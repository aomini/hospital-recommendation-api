const express = require("express");
const { all, create, order } = require("../controllers/PriorityController");
const router = express.Router();
const UserAuth = require("../middlewares/UserAuth");

router.get("/", UserAuth, all);
router.post("/", UserAuth, create);
router.put("/order", UserAuth, order);

module.exports = router;
