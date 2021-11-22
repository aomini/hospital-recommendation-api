const express = require("express");
const Router = express.Router();
const {
  all,
  create,
  update,
  destroy,
} = require("../controllers/LookupValueController");
const UserAuth = require("../middlewares/UserAuth");

Router.get("/:lookupID", UserAuth, all);
Router.post("/:lookupID", UserAuth, create);
Router.put("/:id", UserAuth, update);
Router.delete("/:id", UserAuth, destroy);

module.exports = Router;
