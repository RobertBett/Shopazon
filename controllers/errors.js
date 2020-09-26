exports.get404Page = (req,res,next)=>{
    res.status(404).render('error-pages/404', { pageTitle: 'Page Not Found', path:'', isLoggedIn: req.isLoggedIn});
};

exports.get500Page = (req,res,next)=>{
    res.status(500).render('error-pages/500', { pageTitle: 'Error', path:'', isLoggedIn: req.isLoggedIn});
};