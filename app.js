const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { get404Page } = require('./controllers/errors');
const chalk = require('chalk');
const mongoose = require('mongoose');

// const { mongoConnect } = require('./utils/database');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./models/User');
// const { getDb } = require('./utils/database');


const port = 8080

app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
    User.findById('5eebc5130e17fe60690e87f9')
        .then((user) => {
            req.user = user;
            next()
        }).catch((err) => { 
            console.log(err)
        });
});

app.use(adminRoutes);
app.use(shopRoutes);
app.use('/',get404Page); 


// mongoConnect(()=>{
//     User.findById('5ee2ed44b1b89c2549942daf')
//     .then((user) => {
//         if(user){
//             const { _id, username, email,cart} = user;
//             const db = getDb();
//             return db.collection('user')
//                 .updateOne(
//                     { _id}, 
//                     { $set:{ username, email, cart, userId:user._id} } 
//                 )
//         }
//         console.log(user, ['HOW SWAY'])
//         const newUser = new User('Roberto', 'test@test.com')
//         return !user && newUser.save()
//     })
//     .then((value) => {
//         app.listen(port, () => {
//             console.log(chalk.green.bold(`On Port:${port}`))
//             console.log(chalk.green.bold.underline(`Running on http://localhost:${port}`))
//         });
//     })
//     .catch((err) => {
//         console.error(err);
//     });
// });

mongoose.connect('mongodb+srv://robert:shopazon@cluster0-rdtzx.mongodb.net/Shop?retryWrites=true&w=majority', { useFindAndModify: false })
.then((result) => {
    User.findById('5eebc5130e17fe60690e87f9')
    .then((user) => {
       const newUser = new User({
            userName:'Robertoo',
            email: 'roberto@test.come',
            cart:{
                items:[]
            }
        })
        !user && newUser.save();
    })
    .then(() => {
        app.listen(port, () => {
            console.log(chalk.green.bold(`On Port:${port}`))
            console.log(chalk.green.bold.underline(`Running on http://localhost:${port}`))
        }); 
    })
    .catch((err) => { 
        console.log(err)
    });
    

}).catch((err) => {
    console.error(err);
});


