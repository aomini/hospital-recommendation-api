const express = require("express");
const app = express();
const userRoutes = require('./routes/user')
const bodyParser = require('body-parser')
require("dotenv").config();
const port = process.env.PORT

app.use(bodyParser.json());
app.use('/api/user',userRoutes)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

