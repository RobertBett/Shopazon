const User = require("../models/User");
const bcrypt = require('bcryptjs')

exports.getLogin = (req,res, next) =>{
        const valError = req.flash('error').length > 0 ? req.flash('error')[0] : false
        console.log(req.flash('error')[0] , 'WHATS REALLY IN HERE??')
        res.render('auth/login', {
            pageTitle: 'Login',
            path:'/login',
            formsCSS: true,
            productCSS: true,
            activeAddProduct: true,
            errorMessage: valError
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
            req.flash('error', 'invalid email or password');
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
            req.flash('error', 'invalid email or password');
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