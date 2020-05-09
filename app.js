const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { get404Page } = require('./controllers/errors')
const db = require('./utils/database');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

/* SQL queries can be written here 
.then() is possible since we're exporting the DB with a promise
*/
db.execute('SELECT * FROM products')
    .then(result => {
        console.log(result[0]);
    })
    .catch( err => {
        console.log(err);
    });

const port = 8080

app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(adminRoutes);
app.use(shopRoutes,);

app.use('/',get404Page); 

app.listen(port, () => {console.log(`on Port:${port}`), console.log(`running on http://localhost:${port}`)})
