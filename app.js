require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { get404Page } = require('./controllers/errors');
const chalk = require('chalk');
const mongoose = require('mongoose');
const session = require('express-session');
const csrf = require('csurf');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const multer = require('multer');
const uniqid = require('uniqid');
const csrfProtection = csrf();
const morgan = require('morgan');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const User = require('./models/User');


const fileStorage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, 'images');
    },
    filename: (req, file, cb) =>{
        cb(null, uniqid() + '_' + file.originalname);
    }
});

const fileFilter = ( req, file, cb) =>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null, true);
    }else{
        cb(null, false);
    }
};

const uri = process.env.MONGO_URL;
const store = new MongoDBStore({
    uri,
    collection: 'sessions',
});

app.set('view engine', 'ejs');
app.set('views', 'views');



app.use(morgan('[:date[clf]] :method :url HTTP/:http-version :status :res[content-length]'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(multer({ storage: fileStorage, fileFilter}).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(
    session({ 
        secret: 'my secret', 
        resave: false, 
        saveUninitialized: false,
        store 
    })
);
app.use(csrfProtection);
app.use((req, res ,next)=>{
    const UserId = req.session.user && req.session.user._id;
    User.findById(UserId)
        .then((user) => {
            req.user = user;
            next()
        }).catch((err) => { 
            console.log(err);
        });
});

app.use((req, res, next) =>{
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    res.locals.userName = req.session.user && req.session.user.userName;

    next();
})
app.use(flash());

app.use(adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/',get404Page);


const port = 8080;

mongoose.connect(uri, { useFindAndModify: false })
.then(() => {
    app.listen(port, () => {
        console.log(chalk.green.bold(`On Port:${port}`))
        console.log(chalk.green.bold.underline(`Running on http://localhost:${port}`))
    }); 
}).catch((err) => {
    console.error(err);
});


