const express = require("express");
const router = express.Router();
const UserAuth = require("../middlewares/UserAuth");
const {
  getPoints,
  createPoint,
  updatePoint,
  deletePoint,
} = require("../controllers/PointController");

router.get("/", UserAuth, getPoints);
router.post("/", UserAuth, createPoint);
router.put("/:id", UserAuth, updatePoint);
router.delete("/:id", UserAuth, deletePoint);

module.exports = router;
