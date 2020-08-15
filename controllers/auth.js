const User = require("../models/User");
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator/check');
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{ 
        api_key:'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'
    }
}));

exports.getLogin = (req,res, next) =>{
        res.render('auth/login', {
            pageTitle: 'Login',
            path:'/login',
            formsCSS: true,
            productCSS: true,
            activeAddProduct: true,
            oldInput:{},
            errorMessage: null
        });
};

exports.getSignup = (req,res, next) =>{
        res.render('auth/signup', {
            pageTitle: 'signup',
            path:'/signup',
            formsCSS: true,
            productCSS: true,
            activeAddProduct: true,
            oldInput:{},
            errorMessage: null
        });
};

exports.postLogin = (req,res, next) =>{
    const {email, password } = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('auth/login', {
            pageTitle: 'Login',
            path:'/login',
            formsCSS: true,
            productCSS: true,
            activeAddProduct: true,
            oldInput:{email},
            errorMessage: errors.array()[0].msg
        });
    }
    User.findOne({ email })
    .then((user) => {
        console.log(password)
        bcrypt.compare(password, user.password)
        .then((match) => {
            if(match){
                req.session.user = user;
                req.session.isLoggedIn = true;
                return req.session.save((err) => {
                    console.error(err);
                    res.redirect('/')
                })
            }
            throw new Error()
        }).catch((err) => {
            console.error(err)
            return res.redirect('/login')
        });
    }).catch((err) => { 
        console.error(err);
    });
};

exports.postSignup = (req,res, next) =>{
   const {email, userName, password, confirmPassword } = req.body;
   const errors = validationResult(req);
   if(!errors.isEmpty()){
       return res.status(422).render('auth/signup', {
        pageTitle: 'signup',
        path:'/signup',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
        oldInput:{email, userName},
        errorMessage: errors.array()[0].msg
    });
   }
    bcrypt.hash(password, 12)
        .then((hashedPassword) => {
            const user = new User({
                userName,
                email,
                password: hashedPassword,
                cart: { items:[] }
            })
            return user.save();
        })
        .then(() => { 
            res.redirect('/login') 
            return transporter.sendMail({
                to: email,
                from: 'robertbett6@gmail.com',
                subject: 'Successful Signup',
                html:`<h1> Hi ${userName} </h1>
                    <h2>Welcome to Shopazon</h2>
                    <h3>You have successfully signed up</h3>`
            })
        }).catch((err) => {
            console.error(err);
        });
};

exports.getReset = (req,res, next) =>{
    const {email} = req.params;
    console.log(email,'THIS SHOULD BE AN EMAIL')
    res.render('auth/reset', {
        pageTitle: 'Reset Password',
        path:'/reset',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
        oldInput:{email},
        errorMessage: req.flash('error')
    });
}

exports.postReset = (req, res, next) =>{
    const {email} = req.body
    let userName;
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.error(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({ email })
        .then((user) => {
            if(!user){
                req.flash('error', 'An account with that Email does not exist');
                return res.redirect('/reset');
            }
            userName = user.userName;
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save()
        }).then((value) => {
            console.log(value)
            res.redirect('/login');
            return transporter.sendMail({
                to: email,
                from: 'robertbett6@gmail.com',
                subject: 'Passoword Reset',
                html:`
                <h1> Hi ${userName}</h1>
                <h2>You Requested a  Password Reset</h2>
                <h3>Click this link <a href='http://localhost:8080/reset/${token}'>Reset Password</a></h3>
                `
            })
        }).catch((err) => {
            console.error(err);
        });
    });
};

exports.getNewPassword = ( req, res, next) =>{
    const { token } = req.params;
    User.findOne({resetToken:token, resetTokenExpiration:{ $gt: Date.now()}})
    .then((user) => {
        res.render('auth/new-password', {
            pageTitle: 'Set New Password',
            path:'/new-password',
            formsCSS: true,
            productCSS: true,
            activeAddProduct: true,
            errorMessage: req.flash('error'),
            userId: user._id.toString(),
            passwordToken: token
        });  
    }).catch((err) => {
        console.error(err);
    });
};

exports.postNewPassword = (req, res, next ) =>{
    const {userId, newPassword, passwordToken } = req.body;
    let userName;
    let newUser;
    User.findOne({resetToken:passwordToken, 
        resetTokenExpiration:{ $gt: Date.now()},
        _id: userId
    }).then((user) => {
        userName = user.userName
        newUser = user
        return bcrypt.hash(newPassword, 12)

    }).then((hashedPassword) => {
        newUser.password = hashedPassword;
        newUser.resetToken = undefined;
        newUser.resetTokenExpiration = undefined;
        return newUser.save(); 
    })
    .then(() => { 
        res.redirect('/login') 
        return transporter.sendMail({
            to: newUser.email,
            from: 'robertbett6@gmail.com',
            subject: 'Password Reset',
            html:`<h1> Hi ${userName} </h1>
                <h3>You have successfully reset your password </h3>`
        })
    }).catch((err) => {
        console.error(err);
    });

}

exports.postLogout = (req,res, next) =>{
    req.session.destroy( err =>{
        console.error(err);
        res.redirect('/');
    });
};