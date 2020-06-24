const User = require("../models/User");

exports.getLogin = (req,res, next) =>{
    const isLoggedIn = req.session && req.session.isLoggedIn
    console.log(req.get('Cookie'))
        res.render('auth/login', {
            pageTitle: 'Login',
            path:'/login',
            formsCSS: true,
            productCSS: true,
            activeAddProduct: true,
            isLoggedIn
        });
};

exports.postLogin = (req,res, next) =>{
    User.findById('5eebc5130e17fe60690e87f9')
    .then((user) => {
        req.session.user = user;
        req.session.isLoggedIn = true;
        req.session.save((err) => {
            console.error(err);
            res.redirect('/')
        })
    }).catch((err) => { 
        console.log(err)
    });
};

exports.postLogout = (req,res, next) =>{
    req.session.destroy( err =>{
        console.error(err);
        res.redirect('/');
    })
    
};