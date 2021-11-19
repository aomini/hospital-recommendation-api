const express = require("express");
const router = express.Router();
const {
  findAll,
  createUser,
  findUser,
  userLogin,
  updateUser,
  deleteUser,
} = require("../controllers/UserController");
const UserRegisterRequest = require("../http/Request/UserRequest/UserRegisterRequest");

router.get("/", findAll);
router.post("/", UserRegisterRequest, createUser);
router.get("/:id", findUser);
router.post("/login", userLogin);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
