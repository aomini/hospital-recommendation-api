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
const queryOverpass = require("query-overpass");
const axios = require("axios");
const rawPossibleHospitals = require("../possible-hospitals");

const origins = {
  // Tribhuwan internation airport
  distance_from_airport: "27.701803, 85.353394",
  // Koteshwor
  distance_from_koteshwor: "27.678775, 85.349625",
  // Thankot
  distance_from_thankot: "27.686296, 85.201892",
  // Sanga
  distance_from_sanga: "27.634265, 85.484711",
};

const getDirections = ({ origin, destination, mode }) => {
  return axios
    .get("https://maps.googleapis.com/maps/api/directions/json", {
      params: {
        key: "AIzaSyC5Soc1WHnZDKY6Y_bjBC8vuAtpkp8CxFc",
        // lat,lng of tribhuwan international airport
        origin,
        destination,
        mode,
      },
    })
    .then((resp) => {
      const { routes } = resp.data;
      const { legs } = routes[0];
      return [legs[0].distance.value, legs[0].duration.value];
    });
};

const sleep = () => {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, 15000);
  });
};

const getBuildings = async (lat, lng, km = 1) => {
  const meters = km * 1000;
  const query = `
    [out:json];
    (              
    node["building"](around:${meters},${lat}, ${lng} );
    way["building"](around:${meters}, ${lat}, ${lng});
    relation["building"](around:${meters}, ${lat}, ${lng});
    );
    out body;
    >;
    out skel qt;
  `;
  return new Promise((res) => {
    queryOverpass(query, (err, data) => {
      if (err) {
        console.log("@@@@@@", { lat, lng, km }, err);
      }
      res(data.features.length);
    });
  });
};

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

    // Distances from major places
    // test-cases test cases
    const testCoordinates = Object.values(rawPossibleHospitals).map((x) => {
      return [x.lat, x.lng];
    });
    let distancePassedCoordinates = [];
    for (let j = 0; j < testCoordinates.length; j++) {
      const [lat, lng] = testCoordinates[j];

      const originEntries = Object.entries(origins);
      let distanceSum = 0;
      for (let originKey in originEntries) {
        const [k, v] = originEntries[originKey];
        const [distance] = await getDirections({
          origin: v,
          destination: `${lat},${lng}`,
          mode: "driving",
        });
        distanceSum += distance;
      }
      const avgDistance = Math.floor(distanceSum / 4000);
      if (avgDistance <= 12) {
        distancePassedCoordinates.push([lat, lng]);
      }
    }

    // Is far away from significant hospitals
    let farAwayFromSignificantHospitals = [];
    for (let k = 0; k < distancePassedCoordinates.length; k++) {
      const [lat, lng] = distancePassedCoordinates[k];

      for (let l = 0; l < significantLatLng.length; l++) {
        const { latitude, longitude } = significantLatLng[l];
        const [distance, duration] = await getDirections({
          origin: `${latitude}, ${longitude}`,
          destination: `${lat},${lng}`,
          mode: "driving",
        });
        if (duration < 600) {
          break;
        } else {
          farAwayFromSignificantHospitals = [[lat, lng]];
        }
      }
    }

    // significant hospitals in 1km
    const building_1k_id = await FieldItem.findOne({
      where: {
        code: "buildings_1km_radius",
      },
    });
    const details1Km = await HospitalDetail.findAll({
      attributes: [[sequelize.json("value.value"), "value"]],
      where: {
        hospital_id: {
          [Op.in]: significantHospitalIds,
        },
        field_item_id: building_1k_id.id,
      },
    });
    const values = details1Km.map((x) => (x.value ? parseInt(x.value) : 0));
    const avgBuildingsIn1Km = Math.floor(
      values.reduce((a, i) => {
        return a + i;
      }, 0) / 10
    );

    // Significant hospitals in 3k
    const building_3k_id = await FieldItem.findOne({
      where: {
        code: "buildings_3km_radius",
      },
    });
    const details3Km = await HospitalDetail.findAll({
      attributes: [[sequelize.json("value.value"), "value"]],
      where: {
        hospital_id: {
          [Op.in]: significantHospitalIds,
        },
        field_item_id: building_3k_id.id,
      },
    });
    const values3Km = details3Km.map((x) => (x.value ? parseInt(x.value) : 0));
    const avgBuildingsIn3Km = Math.floor(
      values3Km.reduce((a, i) => {
        return a + i;
      }, 0) / 10
    );

    // Significant hospital in 5k
    const building_5k_id = await FieldItem.findOne({
      where: {
        code: "buildings_5km_radius",
      },
    });
    const details5Km = await HospitalDetail.findAll({
      attributes: [[sequelize.json("value.value"), "value"]],
      where: {
        hospital_id: {
          [Op.in]: significantHospitalIds,
        },
        field_item_id: building_5k_id.id,
      },
    });
    const values5Km = details5Km.map((x) => (x.value ? parseInt(x.value) : 0));
    const avgBuildingsIn5Km = Math.floor(
      values5Km.reduce((a, i) => {
        return a + i;
      }, 0) / 10
    );

    const idealPopulationIn1Km = avgBuildingsIn1Km;
    const idealPopulationIn3Km = Math.floor(avgBuildingsIn3Km * 0.6);
    const idealPopulationIn5Km = Math.floor(avgBuildingsIn5Km * 0.5);

    // Test-cases for testing buildings
    let foundMatch = null;
    for (let i = 0; i < farAwayFromSignificantHospitals.length; i++) {
      const [testLat, testLng] = farAwayFromSignificantHospitals[i];
      const testBuildingIn1Km = await getBuildings(testLat, testLng, 1);

      await sleep();

      const testBuildingIn3Km = await getBuildings(testLat, testLng, 1);
      await sleep();
      const testBuildingIn5Km = await getBuildings(testLat, testLng, 1);
      await sleep();

      if (
        testBuildingIn1Km <= idealPopulationIn1Km &&
        testBuildingIn3Km <= idealPopulationIn3Km &&
        testBuildingIn5Km <= idealPopulationIn5Km
      ) {
        foundMatch = [testLat, testLng];
      }
    }

    const data = await createReport({
      significantHospitals: JSON.parse(JSON.stringify(significantHospitals)),
      fields,
      hospitalDetails,
      weights,
      foundMatch,
    });

    // const distanceFields = await FieldItem.findAll({
    //   where: {
    //     code: {
    //       [Op.in]: [
    //         "distance_from_thankot",
    //         "distance_from_koteshwor",
    //         "distance_from_sanga",
    //         "distance_from_airport",
    //       ],
    //     },
    //   },
    // });
    // const distanceFieldIds = distanceFields.map((x) => x.id);

    // const significantHospitalDistanceDetails = await HospitalDetail.findAll({
    //   where: {
    //     field_item_id: {
    //       [Op.in]: distanceFieldIds,
    //     },
    //     hospital_id: {
    //       [Op.in]: significantHospitalIds,
    //     },
    //   },
    // });

    // console.log(significantHospitalDistanceDetails[0]);
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
