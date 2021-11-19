const { Lookup, LookupValue } = require("../../models");

module.exports.all = async (req, res) => {
  const { lookupID } = req.params;
  try {
    const lookup = await Lookup.findByPk(lookupID, {
      include: "LookupValues",
    });
    res.send(lookup);
  } catch (err) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};

/** @validation label and value both are required */
module.exports.create = async (req, res) => {
  const { lookupID } = req.params;

  try {
    const lookupValue = await LookupValue.create({
      lookup_id: lookupID,
      userc_id: 1,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      data: lookupValue,
    });
  } catch (err) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};

/** @validation label and value both are required */
module.exports.update = async (req, res) => {
  const { id } = req.params;

  try {
    const found = await LookupValue.findByPk(id);

    if (!found) {
      return res.status(404).send({
        success: false,
        message: "Lookup Value not found",
      });
    }

    await found.update({
      useru_id: 1,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      data: await LookupValue.findByPk(id),
    });
  } catch (err) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.destroy = async (req, res) => {
  const { id } = req.params;
  console.log("here", id);
  try {
    const found = await LookupValue.findByPk(id);

    if (!found) {
      return res.status(404).send({
        success: false,
        message: "Lookup Value not found",
      });
    }

    await found.update({
      useru_id: 1,
      deleted_at: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Lookup value removed successfully",
    });
  } catch (err) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};
