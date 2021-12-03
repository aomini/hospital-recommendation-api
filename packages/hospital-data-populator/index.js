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
const getFakeValues = require("./fakeData");
const buildingData = require("./building-data");
const axios = require("axios");

const { Op } = Sequelize;

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
        key: process.env.API_KEY,
        // lat,lng of tribhuwan international airport
        origin,
        destination,
        mode,
      },
    })
    .then((resp) => {
      const { routes } = resp.data;
      const { legs } = routes[0];
      return [legs[0].distance.text, legs[0].duration.text];
    });
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
  const fields = await FieldItem
    .findAll
    //   {
    //   where: {
    //     code: {
    //       [Op.in]: [
    //         "name_of_hospital",
    //         "address",
    //         "phone_number",
    //         "longitude",
    //         "latitude",
    //         "website",
    //         "distance_from_airport",
    //         "distance_from_koteshwor",
    //         "distance_from_thankot",
    //         "distance_from_sanga",
    //       ],
    //     },
    //   },
    // }
    ();

  await sequelize.transaction(async (t) => {
    try {
      for (let key in hospitals) {
        const { Name: name, Place_ID: place_id } = hospitals[key];
        console.log(`processing ${parseInt(key) + 1}. ${name}}`);

        let { reviews, ...rest } = await getDetails(place_id);

        rest = {
          ...rest,
          ...(await getFakeValues()),
          buildings_1km_radius: buildingData[place_id][1],
          buildings_3km_radius: buildingData[place_id][3],
          buildings_5km_radius: buildingData[place_id][5],
        };

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
            userc_id: user.id,
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
