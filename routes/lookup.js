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

Router.get("/", UserAuth, all);
Router.get("/:code", UserAuth, find);
Router.post("/", UserAuth, LookupCreateRequest, create);
Router.put("/:id", UserAuth, LookupCreateRequest, update);
Router.delete("/:id", UserAuth, destroy);

module.exports = Router;
