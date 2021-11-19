const express = require("express");
const Router = express.Router();
const {
  all,
  create,
  update,
  destroy,
} = require("../controllers/LookupController");

Router.get("/", all);
Router.post("/", create);
Router.put("/:id", update);
Router.delete("/:id", destroy);

module.exports = Router;
