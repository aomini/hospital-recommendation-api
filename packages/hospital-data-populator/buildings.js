const queryOverpass = require("query-overpass");

const sleep = () => {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, 5000);
  });
};

const buildings = async (lat, lng, km = 1) => {
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

buildings(27.6863031, 85.33880379999999, 1).then((resp) => {
  console.log(resp);
});

module.exports = buildings;
