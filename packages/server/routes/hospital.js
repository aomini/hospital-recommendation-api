const express = require("express");
const {
  all,
  findHospital,
  getHospitalsWithBasicData,
  create,
  update,
  updateSignificance,
  findTopHospitals,
} = require("../controllers/HospitalController");
const UserAuth = require("../middlewares/UserAuth");

const router = express.Router();

router.get("/", UserAuth, all);
router.get("/basic", getHospitalsWithBasicData);
router.get("/top-hospitals", UserAuth, findTopHospitals);
router.get("/:hospitalID", UserAuth, findHospital);
router.post("/", UserAuth, create);
router.put("/:hospitalID/:fieldID", UserAuth, update);
router.patch("/:id/significance", UserAuth, updateSignificance);

module.exports = router;
