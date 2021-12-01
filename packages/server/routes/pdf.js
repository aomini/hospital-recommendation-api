const express = require("express");
const UserAuth = require("../middlewares/UserAuth");
const { createReport } = require("@hospital-api/pdf-generator");

const router = express.Router();

const generatePdf = async (req, res) => {
  try {
    const data = await createReport();
    res.send(data);
  } catch (e) {
    res.send(e);
  }
};

router.get("/", generatePdf);

module.exports = router;
