const express = require("express");
const {
  all,
  create,
  update,
  destroy,
} = require("../controllers/FieldController");
const router = express.Router();

router.get("/", all);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", destroy);

module.exports = router;
