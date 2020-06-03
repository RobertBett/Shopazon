const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { get404Page } = require('./controllers/errors');
const chalk = require('chalk');

const { mongoConnect } = require('./utils/database');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./models/User');



const port = 8080

app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
    User.findById('5ed16618d0899766ea3cd4dc')
        .then((user) => {
        req.user = new User(user.username, user.email,user.cart, user._id);
        next();
        }).catch((err) => {
            console.log(err)
        });
});

app.use(adminRoutes);
app.use(shopRoutes);
app.use('/',get404Page); 



mongoConnect(()=>{
    User.findById('5ec58dbd7f8becd48808480b')
    .then((user) => {
        console.log(user, ['HOW SWAY'])
        const newUser = new User('Roberto', 'test@test.com')
        return !user && newUser.save()
    })
    .then((value) => {
        app.listen(port, () => {
            console.log(chalk.green.bold(`On Port:${port}`))
            console.log(chalk.green.bold.underline(`Running on http://localhost:${port}`))
        });
    })
    .catch((err) => {
        console.error(err);
    });
});



