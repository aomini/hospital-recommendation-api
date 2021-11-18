require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
