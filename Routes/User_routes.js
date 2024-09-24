const express = require('express');
const user_controller = require('../Controller/User_Controller')
const router = express.Router();

router.post('/register',user_controller.PostSignup);

router.post('/login',user_controller.PostLogin)

module.exports = router