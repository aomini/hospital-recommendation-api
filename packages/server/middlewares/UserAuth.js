const { User } = require("../models");
const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  if (!("authorization" in req.headers)) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const [bearer, token] = req.headers.authorization.split(" ");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findByPk(verified.id);
    if (user) {
      req.user = user;
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    res.status(400).send(err.message || "Invalid token");
  }
};
