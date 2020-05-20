const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { get404Page } = require('./controllers/errors');
const chalk = require('chalk');

const mongoConnect = require('./utils/database').mongoConnect;

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');



const port = 8080

app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
    // User.findByPk(1)
    // .then((user) => {
    //    req.user = user;
    //    next();
    // }).catch((err) => {
    //     console.log(err)
    // });
    next()
});

app.use(adminRoutes);
app.use(shopRoutes);
app.use('/',get404Page); 



mongoConnect(()=>{
    app.listen(port, () => {
        console.log(chalk.green.bold(`On Port:${port}`))
        console.log(chalk.green.bold.underline(`Running on http://localhost:${port}`))
    });
});



