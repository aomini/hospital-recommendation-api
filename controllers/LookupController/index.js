const { Lookup } = require("../../models");

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

/** @validation name & code are both required and code must be unique */
module.exports.create = async (req, res) => {
  try {
    const lookup = await Lookup.create(req.body);
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
  console.log(id);
  try {
    const found = await Lookup.findByPk(id);

    if (!found) {
      return res.status(404).send({
        success: false,
        message: "Lookup not found",
      });
    }

    await found.update(req.body);
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

    await found.destroy();
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
