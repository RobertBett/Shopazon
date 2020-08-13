const express = require('express');
const { getSignup, getLogin, postSignup, postLogin, postLogout, 
    getReset, postReset, getNewPassword, postNewPassword } = require('../controllers/auth');
const router = express();

router.get('/login', getLogin);
router.get('/signup', getSignup);
router.get('/reset', getReset);
router.get('/reset/:token', getNewPassword);
router.post('/new-password', postNewPassword);
router.post('/reset', postReset);
router.post('/signup', postSignup);
router.post('/login', postLogin);
router.post('/logout', postLogout);


module.exports = router;