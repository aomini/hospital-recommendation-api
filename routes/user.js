const express = require('express');
const router = express.Router();
const { findAll, createUser, findUser, } = require('../controllers/UserController')

router.get('/', findAll);
router.post('/', createUser);
router.get('/:id', findUser);







module.exports = router;