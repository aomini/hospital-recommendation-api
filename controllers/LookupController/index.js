const { Lookup, Sequelize } = require("../../models");
const { Op } = Sequelize;

module.exports.all = async (req, res) => {
  try {
    const lookups = await Lookup.findAll();
    res.send(lookups);
  } catch (err) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.find = async (req, res) => {
  try {
    const lookup = await Lookup.findOne({
      include: "LookupValues",
      where: {
        code: req.params.code,
      },
    });
    res.json({
      data: lookup,
    });
  } catch (err) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};

const checkLookup = async (req, id) => {
  if (id) {
    const lookup = await Lookup.findOne({
      where: {
        code: req.body.code,
        id: {
          [Op.ne]: id,
        },
      },
    });
    return lookup;
  }
  const lookup = await Lookup.findOne({
    where: {
      code: req.body.code,
    },
  });
  return lookup;
};

module.exports.create = async (req, res) => {
  try {
    if (checkLookup(req)) {
      return res.status(422).json({
        code: "lookup with that code already exists",
      });
    }
    const lookup = await Lookup.create({ ...req.body, userc_id: 1 });
    res.status(201).json({
      success: true,
      data: lookup,
    });
  } catch (err) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};

/** @validation name & code are both required and code must be unique */
module.exports.update = async (req, res) => {
  const { id } = req.params;

  if (checkLookup(req, id)) {
    return res.status(422).json({
      code: "lookup with that code already exists",
    });
  }

  try {
    const found = await Lookup.findByPk(id);

    if (!found) {
      return res.status(404).send({
        success: false,
        message: "Lookup not found",
      });
    }

    await found.update({ ...req.body, useru_id: 1 });
    res.status(201).json({
      success: true,
      data: await Lookup.findByPk(id),
    });
  } catch (err) {
    console.log(err);
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.destroy = async (req, res) => {
  const { id } = req.params;
  try {
    const found = await Lookup.findByPk(id);

    if (!found) {
      return res.status(404).send({
        success: false,
        message: "Lookup not found",
      });
    }

    await found.update({ deleted_at: new Date(), userd_id: 1 });

    res.status(201).json({
      success: true,
      message: "Lookup deleted successfully",
    });
  } catch (err) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};
