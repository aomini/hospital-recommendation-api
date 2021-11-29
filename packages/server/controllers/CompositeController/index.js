const { Composite, Hospital, Field } = require("../../models");

module.exports.find = async (req, res, next) => {
  try {
    const { hospitalID, fieldID } = req.params;
    const found = await Hospital.findByPk(hospitalID);
    if (!found) {
      return res.status(404).json({
        message: "Hospital not found",
        success: false,
      });
    }

    const field = await Field.findByPk(fieldID);
    if (!field) {
      return res.status(404).json({
        message: "Field not found",
        success: false,
      });
    }

    const data = await Composite.findOne({
      where: {
        hospital_id: hospitalID,
        field_id: fieldID,
        userc_id: req.user.id,
        useru_id: req.user.id,
      },
    });
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message,
    });
  }
};

module.exports.update = async (req, res, next) => {
  try {
    const { hospitalID, fieldID } = req.params;
    const values = req.body || [];
    const found = await Hospital.findByPk(hospitalID);
    if (!found) {
      return res.status(404).json({
        message: "Hospital not found",
        success: false,
      });
    }

    const field = await Field.findByPk(fieldID);
    if (!field) {
      return res.status(404).json({
        message: "Field not found",
        success: false,
      });
    }

    const alreadyExists = await Composite.findOne({
      where: {
        hospital_id: hospitalID,
        field_id: fieldID,
      },
    });

    const data = {
      hospital_id: hospitalID,
      field_id: fieldID,
      values,
      useru_id: req.user.id,
    };
    if (!alreadyExists) {
      await Composite.create(data);
    } else {
      await Composite.update(data, {
        where: {
          hospital_id: hospitalID,
          field_id: fieldID,
        },
      });
    }
    res.status(200).json({
      status: true,
      data,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message,
    });
  }
};
