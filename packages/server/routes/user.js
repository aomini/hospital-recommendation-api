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
const UserAuth = require("../middlewares/UserAuth");

router.get("/", UserAuth, findAll);
router.post("/", UserRegisterRequest, createUser);
router.get("/me", UserAuth, (req, res) => res.json({ data: req.user }));
router.get("/:id", UserAuth, findUser);
router.post("/login", userLogin);
router.put("/:id", UserAuth, updateUser);
router.delete("/:id", UserAuth, deleteUser);

module.exports = router;
