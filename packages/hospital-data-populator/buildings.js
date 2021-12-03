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

/* 5km radius green field
[out:json][timeout:25];
// gather results
(
  // query part for: “landuse=greenfield”
  // node["landuse"="farm"](around:1000, 27.726818, 85.248619);
  way["landuse"="greenfield"](around:5000, 27.726818, 85.248619);
  //relation["landuse"="greenfield"]({{bbox}});
);
// print results
out body;
>;
out skel qt;
*/
