const express = require("express");
const Router = express.Router();
const {
  all,
  find,
  create,
  update,
  destroy,
} = require("../controllers/LookupController");
const LookupCreateRequest = require("../http/Request/LookupRequest/LookupCreateRequest");
const UserAuth = require("../middlewares/UserAuth");

Router.get("/", all);
Router.get("/:code", find);
Router.post("/", LookupCreateRequest, create);
Router.put("/:id", LookupCreateRequest, update);
Router.delete("/:id", destroy);

module.exports = Router;
