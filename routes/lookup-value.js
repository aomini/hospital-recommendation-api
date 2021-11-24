const express = require("express");
const Router = express.Router();
const {
  all,
  create,
  update,
  destroy,
} = require("../controllers/LookupValueController");
const LookupValueCreateRequest = require("../http/Request/LookupValueRequest/LookupValueCreateRequest");
const UserAuth = require("../middlewares/UserAuth");

Router.get("/:lookupID", UserAuth, all);
Router.post("/:lookupID", UserAuth, LookupValueCreateRequest, create);
Router.put("/:id", UserAuth, LookupValueCreateRequest, update);
Router.delete("/:id", UserAuth, destroy);

module.exports = Router;
