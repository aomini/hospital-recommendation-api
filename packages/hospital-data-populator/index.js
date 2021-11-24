const readXlsx = require("@hospital-api/read-xlsx");
const path = require("path");

const hospitals = readXlsx(path.join(__dirname, "./hospitals.xlsx"));
console.log(hospitals);
