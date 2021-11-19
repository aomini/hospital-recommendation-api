const express = require("express");
const Router = express.Router();
const {
  all,
  create,
  update,
  destroy,
} = require("../controllers/LookupController");
const LookupCreateRequest = require("../http/Request/LookupRequest/LookupCreateRequest");

Router.get("/", all);
Router.post("/", LookupCreateRequest, create);
Router.put("/:id", update);
Router.delete("/:id", destroy);

module.exports = Router;
