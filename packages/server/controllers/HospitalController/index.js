const {
  Hospital,
  Field,
  FieldItem,
  HospitalDetail,
  Sequelize,
} = require("../../models");

module.exports.all = async (req, res, next) => {
  try {
    const { page = 1, status = "published" } = req.query;
    const offset = 10;
    const hospitals = await Hospital.findAndCountAll({
      include: { all: true, nested: true },
      include: [
        {
          model: HospitalDetail,
          attributes: ["value"],
          include: {
            model: FieldItem,
            attributes: ["code"],
            where: {
              code: {
                [Sequelize.Op.in]: [
                  "name_of_hospital",
                  "latitude",
                  "longitude",
                  "address",
                  "phone_number",
                  "website",
                ],
              },
            },
          },
        },
      ],
      where: {
        status,
      },
      offset: (page - 1) * offset,
      limit: offset,
    });
    res.send(hospitals);
  } catch (err) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.findHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findByPk(req.params.hospitalID, {
      include: {
        all: true,
        nested: true,
      },
    });
    res.json({
      data: hospital,
    });
  } catch (err) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.getHospitalsWithBasicData = async (req, res) => {
  try {
    const hospitals = await Hospital.findAll({
      include: [
        {
          model: HospitalDetail,
          attributes: ["value"],
          include: {
            model: FieldItem,
            attributes: ["code"],
            where: {
              code: {
                [Sequelize.Op.in]: [
                  "name_of_hospital",
                  "latitude",
                  "longitude",
                  "address",
                  "phone_number",
                  "website",
                  "distance_from_thankot",
                  "distance_from_koteshwor",
                  "distance_from_sanga",
                  "distance_from_airport",
                ],
              },
            },
          },
        },
      ],
      where: {
        status: "published",
      },
    });
    const mappedDetails = hospitals.map((x) => {
      const details = x.HospitalDetails.reduce((acc, iterator) => {
        acc[iterator.FieldItem.code] = iterator.value.value;
        return acc;
      }, {});
      return {
        id: x.id,
        significance: x.significance,
        ...details,
      };
    });
    return res.send(mappedDetails);
  } catch (err) {
    console.log(err);
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.create = async (req, res) => {
  try {
    const hospital = await Hospital.create({ userc_id: req.user.id });
    res.status(201).json({
      success: true,
      data: hospital,
    });
  } catch (err) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.update = async (req, res) => {
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

    if (found.status === "auto-draft" || req.query.status) {
      const status = found.status === "auto-draft" ? "draft" : req.query.status;
      await found.update({
        status,
        useru_id: req.user.id,
      });
    }

    let detailsData = [];
    for (let data of req.body) {
      const alreadyExists = await HospitalDetail.findOne({
        where: {
          field_item_id: data.field_item_id,
          hospital_id: hospitalID,
        },
      });
      const newFields = {
        field_item_id: data.field_item_id,
        hospital_id: hospitalID,
        userc_id: req.user.id,
        useru_id: req.user.id,
        value: {
          value: data.value,
        },
      };
      detailsData = alreadyExists
        ? [...detailsData, { id: alreadyExists.id, ...newFields }]
        : [...detailsData, newFields];
    }

    const data = await HospitalDetail.bulkCreate(detailsData, {
      updateOnDuplicate: ["value", "useru_id"],
    });

    res.status(201).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};
