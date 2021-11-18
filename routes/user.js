const express = require('express');
const router = express.Router();
const { findAll, createUser, findUser,userLogin } = require('../controllers/UserController')

router.get('/', findAll);
router.post('/', createUser);
router.get('/:id', findUser);
router.post('/login', userLogin);







module.exports = router;