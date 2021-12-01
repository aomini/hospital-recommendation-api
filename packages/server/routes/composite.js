const express = require("express");
const router = express.Router();

const { find, update } = require("../controllers/CompositeController");
const UserAuth = require("../middlewares/UserAuth");

router.get("/:hospitalID/:fieldID", UserAuth, find);

router.put("/:hospitalID/:fieldID", UserAuth, update);

module.exports = router;
