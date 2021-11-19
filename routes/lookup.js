const express = require("express");
const Router = express.Router();
const {
  all,
  create,
  update,
  destroy,
} = require("../controllers/LookupController");
const LookupCreateRequest = require("../http/Request/LookupRequest/LookupCreateRequest");
const UserAuth = require("../middlewares/UserAuth");

Router.get("/", UserAuth, all);
Router.post("/", UserAuth, LookupCreateRequest, create);
Router.put("/:id", UserAuth, update);
Router.delete("/:id", UserAuth, destroy);

module.exports = Router;
