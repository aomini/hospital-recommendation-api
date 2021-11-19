require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const { sequelize } = require("./models");
// const errorMiddleware = require("./middlewares/errors");

const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const hospitalRoutes = require("./routes/hospital");
const fieldRoutes = require("./routes/field");

const bodyParser = require("body-parser");
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(morgan("tiny"));

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/fields", fieldRoutes);

// middleware to handle errors
// @todo fix
// app.use(errorMiddleware);

app.listen(port, () => {
  // sequelize.sync({ alter: true });
  console.log(`Server running on port ${port}`);
});
