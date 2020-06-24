const express = require('express');
const { getLogin, postLogin, postLogout } = require('../controllers/auth');
const router = express();

router.get('/login', getLogin);
router.post('/login', postLogin);
router.post('/logout', postLogout);


module.exports = router;