require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const errorMiddleware = require("./middlewares/errors");

const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const hospitalRoutes = require("./routes/hospital");

const bodyParser = require("body-parser");
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(morgan("tiny"));

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/hospitals", hospitalRoutes);

// middleware to handle errors
// @todo fix
// app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
