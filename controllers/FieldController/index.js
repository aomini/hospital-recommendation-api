const { Field } = require("../../models");

module.exports.all = async (req, res, next) => {
  try {
    const fields = await Field.findAll();
    res.json({
      success: true,
      data: fields,
    });
  } catch (e) {
    res.status(e.code || 500).json({
      message: e.message,
    });
  }
};

/** name is required, weight is required */
module.exports.create = async (req, res, next) => {
  try {
    const lastField = await Field.findOne({
      order: [["order", "DESC"]],
    });
    const order = lastField ? lastField + 1 : 1;

    const field = await Field.create({
      ...req.body,
      order,
      userc_id: 1,
    });
    res.status(201).json({
      message: "Created Successfully",
      data: field,
      success: true,
    });
  } catch (e) {
    res.status(e.code || 500).json({
      message: e.message,
    });
  }
};

/** id is required in params and other params for update */
module.exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;

    const field = await Field.findByPk(id);

    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    await field.update({
      ...req.body,
      useru_id: 1,
    });
    res.status(200).json({
      message: "Updated Successfully",
      data: field,
      success: true,
    });
  } catch (e) {
    res.status(e.code || 500).json({
      message: e.message,
    });
  }
};

/** id is required */
module.exports.destroy = async (req, res, next) => {
  try {
    const { id } = req.params;

    const field = await Field.findByPk(id);

    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    await field.update({
      userd_id: 1,
      deleted_at: new Date(),
    });
    res.status(200).json({
      message: "Deleted Successfully",
      data: field,
      success: true,
    });
  } catch (e) {
    res.status(e.code || 500).json({
      message: e.message,
    });
  }
};
