const express = require("express");
const {
  all,
  findHospital,
  create,
  update,
} = require("../controllers/HospitalController");
const UserAuth = require("../middlewares/UserAuth");

const router = express.Router();

router.get("/", UserAuth, all);
router.get("/:hospitalID", UserAuth, findHospital);
router.post("/", UserAuth, create);
router.put("/:hospitalID/:fieldID", UserAuth, update);

module.exports = router;
