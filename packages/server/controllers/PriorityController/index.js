const { Priority, FieldItem, Field, Sequelize } = require("../../models");

const { Op } = Sequelize;

module.exports.all = async (req, res, next) => {
  try {
    const priorities = await Priority.findAll({
      include: [
        {
          model: FieldItem,
          attributes: ["id", "title", "subtitle", "code"],
          include: {
            model: Field,
            attributes: ["name", "id"],
          },
        },
      ],
      order: [["order", "ASC"]],
    });

    res.json({
      success: true,
      data: priorities,
    });
  } catch (e) {
    res.status(e.code || 500).json({
      message: e.message,
    });
  }
};

module.exports.create = async (req, res, next) => {
  try {
    const existingPriorities = await Priority.findAll({});

    if (existingPriorities.length) {
      return res.status(400).json({
        message: "priorities already created",
      });
    }
    const { fieldItems } = req.body;
    const prioritiesData = fieldItems.map((x, index) => {
      return {
        field_item_id: x,
        weight: 1000 - index * 10,
        order: (index + 1) * 1024,
        userc_id: req.user.id,
      };
    });

    const priorities = await Priority.bulkCreate(prioritiesData);

    res.status(201).json({
      message: "Created Successfully",
      data: priorities,
      success: true,
    });
  } catch (e) {
    res.status(e.code || 500).json({
      message: e.message,
    });
  }
};

module.exports.updatePriorities = async (req, res, next) => {
  try {
    const { fieldItems } = req.body;
    await Priority.destroy({
      where: {
        field_item_id: {
          [Op.notIn]: fieldItems,
        },
      },
    });

    const existingPriorities = await Priority.findAll({});

    // Update orders
    const prioritiesData = fieldItems.map((x, index) => {
      const alreadyCreated = existingPriorities.find(
        (y) => y.field_item_id === x
      );
      const newField = {
        field_item_id: x,
        weight: 1000 - index * 10,
        order: (index + 1) * 1024,
        userc_id: req.user.id,
      };

      return alreadyCreated ? { ...newField, id: alreadyCreated.id } : newField;
    });

    const priorities = await Priority.bulkCreate(prioritiesData, {
      updateOnDuplicate: ["order"],
    });
    res.json({
      message: "complete",
      data: priorities,
    });
  } catch (e) {
    res.status(e.code || 500).json({
      message: e.message,
    });
  }
};

/** incomplete api not in use */
module.exports.order = async (req, res, next) => {
  try {
    const found = await Priority.findByPk(req.params.id);
    if (!found) {
      return res.status(404).json({
        message: "Priority not found",
      });
    }

    const { prev, next } = req.body;
    const averageOrder = (prev + next) / 2;

    await found.update({
      order: averageOrder,
      useru_id: req.user.id,
    });

    res.json({
      success: true,
      message: "order updated",
    });
  } catch (e) {
    res.status(e.code || 500).json({
      message: e.message,
    });
  }
};

module.exports.update = async (req, res, next) => {
  try {
    const priority = await Priority.findByPk(req.params.id);
    if (!priority) {
      return res.status(404).json({
        message: "Priority not found",
      });
    }

    await priority.update({
      ...req.body,
      useru_id: req.user.id,
    });

    res.status(201).json({
      message: "Created Successfully",
      data: await Priority.findByPk(req.params.id),
      success: true,
    });
  } catch (e) {
    res.status(e.code || 500).json({
      message: e.message,
    });
  }
};
