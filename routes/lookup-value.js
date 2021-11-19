const express = require("express");
const Router = express.Router();
const {
  all,
  create,
  update,
  destroy,
} = require("../controllers/LookupValueController");

Router.get("/:lookupID", all);
Router.post("/:lookupID", create);
Router.put("/:id", update);
Router.delete("/:id", destroy);

module.exports = Router;
