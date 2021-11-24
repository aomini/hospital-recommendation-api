const { Priority, FieldItem, Field } = require("../../models");

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
    await Priority.destroy({ truncate: true });
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
