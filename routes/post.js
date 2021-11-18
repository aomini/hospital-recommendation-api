const express = require('express');
const {DemoPost} = require('../controllers/PostController')
const verify = require('../middlewares/UserAuth')
const router = express.Router();

router.get('/',verify, DemoPost);







module.exports = router;