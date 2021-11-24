const axios = require("axios");

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
module.exports = getDirections;
