const express = require('express');
const { getSignup, getLogin, postSignup, postLogin, postLogout } = require('../controllers/auth');
const router = express();

router.get('/login', getLogin);
router.get('/signup', getSignup);
router.post('/signup', postSignup);
router.post('/login', postLogin);
router.post('/logout', postLogout);


module.exports = router;