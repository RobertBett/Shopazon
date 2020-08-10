const User = require("../models/User");
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
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
            errorMessage: req.flash('errorMessage')
        });
};

exports.getSignup = (req,res, next) =>{
        res.render('auth/signup', {
            pageTitle: 'signup',
            path:'/signup',
            formsCSS: true,
            productCSS: true,
            activeAddProduct: true,
        });
};

exports.postLogin = (req,res, next) =>{
    const {email, password } = req.body;
    User.findOne({ email })
    .then((user) => {
        if(!user){
            console.log(req.flash('error'))
            req.flash('errorMessage', 'invalid email ');
            return res.redirect('/login');
        }
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
            req.flash('errorMessage', 'invalid password');
            console.log('WRONG PASSWORD!');
            return res.redirect('/login')
        }).catch((err) => {
            console.error(err)
            return res.redirect('/login')
        });
    }).catch((err) => { 
        console.log(err)
    });
};

exports.postSignup = (req,res, next) =>{
   const {email, userName, password, confirmPassword } = req.body;
    User.findOne({ email })
    .then((result) => {
        if(result) return res.redirect('/signup');
        
        return bcrypt.hash(password, 12)
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
    })
    .catch((err) => {
        console.error(err);
    });
};

exports.getReset = (req,res, next) =>{
    res.render('auth/reset', {
        pageTitle: 'Reset Password',
        path:'/reset',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
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
    })
}

exports.postLogout = (req,res, next) =>{
    req.session.destroy( err =>{
        console.error(err);
        res.redirect('/');
    });
};