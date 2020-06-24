exports.getLogin = (req,res, next) =>{
    const isLoggedIn = req.get('Cookie').split('=')[1]
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
    res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');
    /// thisfd
    res.redirect('/');
};