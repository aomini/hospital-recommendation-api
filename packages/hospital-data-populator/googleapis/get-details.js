const axios = require("axios");

const getDetails = (placeID) => {
  return axios
    .get("https://maps.googleapis.com/maps/api/place/details/json", {
      params: {
        place_id: placeID,
        key: process.env.API_KEY,
        fields:
          "formatted_phone_number,name,rating,formatted_address,business_status,geometry,icon,types,website,reviews",
      },
    })
    .then(function (response) {
      const {
        name,
        icon,
        rating,
        geometry,
        formatted_address,
        formatted_phone_number,
        types,
        website,
        reviews,
      } = response.data.result;
      const data = {
        name_of_hospital: name,
        address: formatted_address,
        phone_number: formatted_phone_number,
        longitude: geometry.location.lng,
        latitude: geometry.location.lat,
        // types: types.join(", "),
        // icon,
        // rating,
        website,
        reviews,
      };

      return data;
    })
    .catch(function (error) {
      console.log(error);
    });
};
module.exports = getDetails;
