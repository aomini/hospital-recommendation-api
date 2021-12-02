const express = require("express");
const UserAuth = require("../middlewares/UserAuth");
const { createReport } = require("@hospital-api/pdf-generator");
const {
  Hospital,
  HospitalDetail,
  Field,
  FieldItem,
  Lookup,
  Sequelize,
  sequelize,
} = require("../models");
const { Op } = Sequelize;

const router = express.Router();

const getLookupByCode = async (code) => {
  try {
    const lookup = await Lookup.findOne({
      include: "LookupValues",
      where: {
        code,
      },
    });
    return lookup;
  } catch (error) {}
};

const getFields = async () => {
  let fields = [];
  const promise = [];
  try {
    let fields = await Field.findAll({
      where: {
        parent_id: {
          [Op.is]: null,
        },
      },
      include: { all: true, nested: true },
      order: [
        ["order", "ASC"],
        [{ model: FieldItem, as: "field_items" }, "order", "asc"],
        [
          { model: Field, as: "childrens" },
          { model: FieldItem, as: "field_items" },
          "order",
          "asc",
        ],
      ],
    });

    fields.forEach((field) => {
      const { multiple, fromLookup, code } = field.meta || {};
      if (multiple && fromLookup) {
        const data = getLookupByCode(code);
        promise.push(data);
      }
    });

    await Promise.all(promise).then((res) => {
      fields = fields.map(({ name, field_items, meta }) => {
        const newData = { name };
        const { multiple, fromLookup, code } = meta || {};
        if (multiple && fromLookup) {
          const lookupData = res.find((x) => x.code === code);
          newData.field_items = lookupData.LookupValues.map((x) => ({
            title: x.label,
          }));
        } else {
          newData.field_items = field_items.map(({ title }) => ({ title }));
        }
        return newData;
      });
    });
    return fields;
  } catch (error) {}
};

const generatePdf = async (req, res) => {
  try {
    // find fields
    const fields = await getFields();
    // find top hospitals
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
          include: [
            {
              model: FieldItem,
              include: [
                {
                  model: Field,
                },
              ],
            },
          ],
        },
      ],
      where: {
        status: "published",
      },
      order: [[Sequelize.col("totalWeight"), "DESC"]],
      limit: 10,
    });

    const hospitalDetails = significantHospitals.map((hospital) => {
      const result = Object.assign(JSON.parse(JSON.stringify(hospital)));
      const data = result.HospitalDetails.reduce((acc, inc) => {
        const item = inc.FieldItem;
        const field = item.Field;
        const curr = acc[field?.meta?.code];
        const newData = {
          id: item.id,
          title: item.title,
          value: inc.value.value,
          code: item.code,
        };
        if (curr) {
          acc[field.meta.code] = { ...curr, items: [...curr.items, newData] };
        } else {
          acc[field.meta.code] = {
            id: field.id,
            title: field.name,
            items: [newData],
          };
        }
        return acc;
      }, {});

      result.sortedData = Object.values(data)
        .sort((a, b) => a.id - b.id)
        .map((x) => ({ ...x, items: x.items.sort((a, b) => a.id - b.id) }));

      return result;
    });

    const data = await createReport({
      significantHospitals,
      fields,
      hospitalDetails,
    });

    res.send(data);
  } catch (e) {
    res.status(e.code || 500).json({
      success: false,
      message: e.message,
    });
  }
};

router.get("/", generatePdf);

module.exports = router;
