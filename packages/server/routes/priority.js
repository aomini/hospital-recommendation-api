const express = require("express");
const {
  all,
  create,
  updatePriorities,
  update,
  order,
} = require("../controllers/PriorityController");
const PriorityUpdateRequest = require("../http/Request/PriorityRequest/PriorityUpdateRequest");
const router = express.Router();
const UserAuth = require("../middlewares/UserAuth");

router.get("/", UserAuth, all);
router.post("/", UserAuth, create);
router.put("/", UserAuth, updatePriorities);
router.put("/:id", UserAuth, PriorityUpdateRequest, update);
router.put("/order", UserAuth, order);

module.exports = router;
