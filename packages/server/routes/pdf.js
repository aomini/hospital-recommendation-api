const url = require("url");
const html_to_pdf = require("html-pdf-node");
const express = require("express");
const UserAuth = require("../middlewares/UserAuth");
const { createReport } = require("@hospital-api/pdf-generator");
const {
  Hospital,
  HospitalDetail,
  Field,
  Priority,
  LookupValues,
  FieldItem,
  Lookup,
  Sequelize,
  sequelize,
} = require("../models");
const { Op } = Sequelize;
const puppeteer = require("puppeteer");

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
      include: [{ all: true, nested: true }],
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
      fields = fields.map(({ name, id, field_items, meta }) => {
        const newData = { id, name };
        const { multiple, fromLookup, code } = meta || {};
        if (multiple && fromLookup) {
          const lookupData = res.find((x) => x.code === code);
          newData.field_items = lookupData.LookupValues.map((x) => ({
            title: x.label,
            id: x.id,
          }));
        } else {
          newData.field_items = field_items.map(({ id, title }) => ({
            id,
            title,
          }));
        }
        return newData;
      });
    });
    return fields;
  } catch (error) {}
};

const getPriority = async () => {
  return await Priority.findAll({
    attributes: ["id", "field_item_id", "weight", "order"],
  });
};

/** Field Weight */
const getFieldWeights = async () => {
  const data = await sequelize.query(`
     select *,
      (select sum(weight) from priorities 
        where "field_item_id" 
        in (select id from field_items where field_id = fields.id)) 
      from fields
  `);
  return data;
};

/** Base Screenshot */
const baseScreenshot = async (page) => {
  return await page.goto(
    `${process.env.FRONT_END_URL}/street-map?file=base-screenshot`
  );
};

/** Significant Screenshot */
const significantScreenshot = async (page, hospitals) => {
  return await page.goto(
    `${process.env.FRONT_END_URL}/street-map?file=significant-screenshot&hospitals=[${hospitals}]`
  );
};

/** Significant Hospital Isoline */
const significantHospitalIsoline = async (page, time, hospitals) => {
  return await page.goto(
    `${process.env.FRONT_END_URL}/street-map?file=significant-screenshot-isoline-${time}&hospitals=[${hospitals}]&isoline=true&time=${time}`
  );
};

/** Hospital Screenshot */
const hospitalScreenshot = async (page, hospital) => {
  return await page.goto(
    `${process.env.FRONT_END_URL}/street-map?file=hospital-${hospital}-default&hospital=${hospital}`
  );
};

/** Hospital Isoline */
const hospitalIsoline = async (page, time, hospital) => {
  return await page.goto(
    `${process.env.FRONT_END_URL}/street-map?file=hospital-area-${hospital}-${time}-isoline&hospital=${hospital}&isoline=true&time=${time}`
  );
};

const generatePdf = async (req, res) => {
  try {
    // Scrape
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const waitIsolineApi = async ({ latitude, longitude }) => {
      return await page.waitForResponse((response) => {
        return response
          .url()
          .startsWith(
            `https://api.geoapify.com/v1/isoline?lat=${latitude}&lon=${longitude}`
          );
      });
    };

    const exportMaps = async () => {
      return Promise.all([
        await page.waitForSelector("#export"),
        await page.click("#export"),
        await page.waitForResponse((response) => {
          return response.url().includes("/map/upload");
        }),
      ]);
    };

    if (process.env.GENERATE_IMAGE === "true") {
      /* Generate base screenshot*/
      await baseScreenshot(page);
      await exportMaps();
    }

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

    const significantHospitalIds = significantHospitals.map((x) => x.id);

    if (process.env.GENERATE_IMAGE === "true") {
      /* Generate significant screenshot */
      await significantScreenshot(
        page,
        significantHospitals.map((x) => x.id)
      );
      await exportMaps();
    }

    const fieldWeights = (await getFieldWeights())[0];
    const priorities = await getPriority();

    const hospitalDetails = significantHospitals.map((hospital) => {
      const result = Object.assign(JSON.parse(JSON.stringify(hospital)));
      result.hospitalName = hospital.HospitalDetails.find(
        (x) => x.FieldItem.code === "name_of_hospital"
      ).value.value;
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
          acc[field.meta.code] = {
            ...curr,
            totalWeight: hospital.totalWeight,
            items: [...curr.items, newData],
          };
        } else {
          acc[field.meta.code] = {
            id: field.id,
            totalWeight: hospital.totalWeight,
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

    let significantLatLng = [];
    for (let hosp of hospitalDetails) {
      if (process.env.GENERATE_IMAGE === "true") {
        /** Hospital screenshot */
        await hospitalScreenshot(page, hosp.id);
        await exportMaps();
      }

      const items = hosp.sortedData.find(
        (x) => x.title.toLowerCase() === "general"
      ).items;

      let temp = {};
      for (let iterator of items) {
        if (["longitude", "latitude"].includes(iterator.code)) {
          temp[iterator.code] = iterator.value;
        }
      }
      significantLatLng.push(temp);

      if (process.env.GENERATE_IMAGE === "true") {
        /* Generate hospital isoline for 10m */
        await hospitalIsoline(page, 10, hosp.id);
        await waitIsolineApi(temp);
        await exportMaps();

        /* Generate hospital isoline for 20m*/
        await hospitalIsoline(page, 20, hosp.id);
        await waitIsolineApi(temp);
        await exportMaps();
      }
    }

    if (process.env.GENERATE_IMAGE === "true") {
      /* for time 10 */
      await significantHospitalIsoline(page, 10, significantHospitalIds);
      await Promise.all(
        significantLatLng.map(async (latlng) => {
          return await waitIsolineApi(latlng);
        })
      );
      await exportMaps();
      /** for time 20 */
      await significantHospitalIsoline(page, 20, significantHospitalIds);
      await Promise.all(
        significantLatLng.map(async (latlng) => {
          return await waitIsolineApi(latlng);
        })
      );
      await exportMaps();
    }

    const weights = fields.reduce((acc, itr) => {
      const d = itr.field_items.map((x, index) => {
        const data = {};
        const fields = [];
        data.meta = {
          total: itr.field_items.length,
        };
        if (index === 0) {
          fields.push({ sn: itr.id });
          fields.push({ title: itr.name });
          fields.push({
            weight: fieldWeights.find((y) => y.id === itr.id).sum,
          });
        }
        const p = priorities.find((y) => y.field_item_id === x.id);
        fields.push({ itemTitle: x.title });
        fields.push({ itemWeight: p?.weight });
        fields.push({ itemOrder: p?.order });
        data.fields = fields;

        return data;
      });

      return [...acc, ...d];
    }, []);

    const data = await createReport({
      significantHospitals: JSON.parse(JSON.stringify(significantHospitals)),
      fields,
      hospitalDetails,
      weights,
      foundMatch: [1, 2],
    });

    /**Sends pdf */
    // html_to_pdf
    //   .generatePdf({ content: data }, { format: "A4" })
    //   .then((pdfBuffer) => {
    //     res.contentType("application/pdf");
    //     return res.send(pdfBuffer);
    //   });

    /**Sends html */

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
