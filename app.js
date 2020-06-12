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
const { getDb } = require('./utils/database');


const port = 8080

app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
    User.findById('5ee2ed44b1b89c2549942daf')
        .then((user) => {
            const newUser = new User(user.username, user.email,user.cart, user._id);
            req.user = newUser
            next()
        }).catch((err) => { 
            console.log(err)
        });
});

app.use(adminRoutes);
app.use(shopRoutes);
app.use('/',get404Page); 



mongoConnect(()=>{
    User.findById('5ee2ed44b1b89c2549942daf')
    .then((user) => {
        if(user){
            const { _id, username, email,cart} = user;
            const db = getDb();
            return db.collection('user')
                .updateOne(
                    { _id}, 
                    { $set:{ username, email, cart, userId:user._id} } 
                )
        }
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



