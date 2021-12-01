const express = require("express");
const UserAuth = require("../middlewares/UserAuth");
const { createReport } = require("@hospital-api/pdf-generator");
const { Hospital, HospitalDetail, Sequelize, sequelize } = require("../models");

const router = express.Router();

const generatePdf = async (req, res) => {
  try {
    let significantHospitals = await Hospital.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(
              `(
                select sum(weight)::INTEGER from hospital_details as hd 
                inner join priorities 
                  on priorities.field_item_id = hd.field_item_id 
                  where hd.hospital_id="Hospital"."id" 
                  AND hd.value->'value' NOT in ('null', '""', 'false', '0', '[]')
              )`
            ),
            "totalWeight",
          ],
        ],
      },
      include: [
        {
          model: HospitalDetail,
          attributes: ["id", "value"],
          include: "FieldItem",
        },
      ],
      where: {
        status: "published",
      },
      order: [[Sequelize.col("totalWeight"), "DESC"]],
      limit: 10,
    });

    const data = await createReport({ significantHospitals });
    console.log(significantHospitals);
    res.send(data);
  } catch (e) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};

router.get("/", generatePdf);

module.exports = router;
