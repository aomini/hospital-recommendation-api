const express = require("express");
const { all } = require("../controllers/HospitalController");
const router = express.Router();

router.get("/", all);

module.exports = router;
