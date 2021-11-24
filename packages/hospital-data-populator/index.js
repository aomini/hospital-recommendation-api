require("dotenv").config();
const path = require("path");
const readXlsx = require("@hospital-api/read-xlsx");
const {
  User,
  Hospital,
  HospitalDetail,
  FieldItem,
  Sequelize,
  sequelize,
} = require("@hospital-api/server/models");
const getDetails = require("./googleapis/get-details");
const getDirections = require("./googleapis/get-directions");

const { Op } = Sequelize;

const origins = {
  // Tribhuwan internation airport
  distance_from_airport: "27.69801, 85.35922",
  // Koteshwor
  distance_from_koteshwor: "27.6756, 85.3459",
  // Thankot
  distance_from_thankot: "27.6868, 85.2024",
  // Sanga
  distance_from_sanga: "27.6347, 85.484",
};

const computeDefaultValue = (type) => {
  if (type === "text" || type === "textarea" || type === "number") {
    return "";
  } else {
    return null;
  }
};

const main = async () => {
  const hospitals = readXlsx(path.join(__dirname, "./hospitals.xlsx"));

  let hospitalDetails = [];
  const user = await User.findOne({
    where: {
      username: "rootuser",
    },
  });
  const fields = await FieldItem.findAll({
    where: {
      code: {
        [Op.in]: [
          "name_of_hospital",
          "address",
          "phone_number",
          "longitude",
          "latitude",
          "website",
          "distance_from_airport",
          "distance_from_koteshwor",
          "distance_from_thankot",
          "distance_from_sanga",
        ],
      },
    },
  });

  await sequelize.transaction(async (t) => {
    try {
      for (let key in hospitals) {
        const { Name: name, Place_ID: place_id } = hospitals[key];
        console.log(`processing ${parseInt(key) + 1}. ${name}}`);

        let { reviews, ...rest } = await getDetails(place_id);

        const originEntries = Object.entries(origins);
        for (let originKey in originEntries) {
          const [k, v] = originEntries[originKey];
          const [distance] = await getDirections({
            origin: v,
            destination: `${rest.latitude},${rest.longitude}`,
            mode: "driving",
          });
          rest = { ...rest, [k]: distance };
        }

        const hospital = await Hospital.create(
          {
            significance: false,
            status: "published",
          },
          {
            transaction: t,
          }
        );

        const currentHospitalDetail = fields.map((x) => ({
          field_item_id: x.id,
          hospital_id: hospital.id,
          value: { value: rest[x.code] || computeDefaultValue(x.type) },
          userc_id: user.id,
        }));
        hospitalDetails = [...hospitalDetails, ...currentHospitalDetail];
      }
      await HospitalDetail.bulkCreate(hospitalDetails, {
        transaction: t,
      });
      console.log("Completed");
    } catch (error) {
      console.log(error);
    }
  });
};
main();
