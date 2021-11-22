const express = require("express");
const {
  all,
  create,
  update,
  destroy,
} = require("../controllers/FieldController");
const router = express.Router();
const UserAuth = require("../middlewares/UserAuth");

router.get("/", UserAuth, all);
router.post("/", UserAuth, create);
router.put("/:id", UserAuth, update);
router.delete("/:id", UserAuth, destroy);

module.exports = router;
