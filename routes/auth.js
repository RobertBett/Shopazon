const express = require('express');
const {check, body} = require('express-validator/check');
const { getSignup, getLogin, postSignup, postLogin, postLogout, 
    getReset, postReset, getNewPassword, postNewPassword } = require('../controllers/auth');
const User = require('../models/User');
const router = express();

const validations = { 
    loginValidations :[
        check('email')
        .isEmail()
        .withMessage('Please enter a Valid Email')
        .custom(( email, { req })=>{
            return User.findOne({ email })
            .then((result) => {
                if(!result) return Promise.reject('An account with that email does not exist try signing in!');
            })
        }),
        body('password',
        'Please enter a valid Password'
        ).isLength({ min: 5 }).isAlphanumeric()
    ], 
    signupValidations :[
        check('email')
        .isEmail()
        .withMessage('Please enter a Valid Email')
        .custom(( email, { req })=>{
            return User.findOne({ email })
            .then((result) => {
                if(result) return Promise.reject('Email Already Exists Try Signing in!');
            })
        }),
        body('password',
        'Please enter a valid Password'
        ).isLength({ min: 5 }).isAlphanumeric(),
        body('confirmPassword')
        .custom((value, { req }) =>{
            if(value != req.body.password){
                return new Error('Passwords do not match!')
            }
            return true;
        })
    ]
}

router.get('/login', getLogin);
router.get('/signup', getSignup);
router.get('/reset/:email', getReset);
router.get('/reset/:token', getNewPassword);
router.post('/new-password', postNewPassword);
router.post('/reset', postReset);
router.post('/login',validations.loginValidations, postLogin);
router.post('/signup', validations.signupValidations, postSignup);
router.post('/logout', postLogout);


module.exports = router;