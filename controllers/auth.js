const User = require("../models/User");
const bcrypt = require('bcryptjs')

exports.getLogin = (req,res, next) =>{
    const isLoggedIn = req.session && req.session.isLoggedIn
        res.render('auth/login', {
            pageTitle: 'Login',
            path:'/login',
            formsCSS: true,
            productCSS: true,
            activeAddProduct: true,
            isLoggedIn
        });
};

exports.getSignup = (req,res, next) =>{
    const isLoggedIn = req.session && req.session.isLoggedIn
        res.render('auth/signup', {
            pageTitle: 'signup',
            path:'/signup',
            formsCSS: true,
            productCSS: true,
            activeAddProduct: true,
            isLoggedIn
        });
};

exports.postLogin = (req,res, next) =>{
    const {email, password } = req.body;
    User.findOne({ email })
    .then((user) => {
        if(!user){
            return res.redirect('/login');
        }
        bcrypt.compare(password, user.password)
        .then((match) => {
            if(match){
                req.session.user = user;
                req.session.isLoggedIn = true;
                req.session.save((err) => {
                    console.error(err);
                    return res.redirect('/')
                })
            }
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
        .then(() => { res.redirect('/login') });
    })
    .catch((err) => {
        console.error(err);
    });
};

exports.postLogout = (req,res, next) =>{
    req.session.destroy( err =>{
        console.error(err);
        res.redirect('/');
    });
};