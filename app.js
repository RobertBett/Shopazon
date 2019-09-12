const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { get404Page } = require('./controllers/errors')

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const port = 8080

app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(adminRoutes);
app.use(shopRoutes,);

app.use('/',get404Page); 

app.listen(port, () => {console.log(`on Port:${port}`), console.log(`running on http://localhost:${port}`)})
