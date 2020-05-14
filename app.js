const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { get404Page } = require('./controllers/errors');
const sequelize = require('./utils/database');
const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');
const CartItem = require('./models/CartItem');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


const port = 8080

app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
    User.findByPk(1)
    .then((user) => {
       req.user = user;
       next();
    }).catch((err) => {
        console.log(err)
    });
});

app.use(adminRoutes);
app.use(shopRoutes,);

app.use('/',get404Page); 

/* Attaching Assosications/Relations to SQL */
Product.belongsTo(User,{ constraints:true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem});
Product.belongsToMany(Cart, { through: CartItem});

sequelize.sync()
.then((result) => {
  return User.findByPk(1)  
})
.then((user) => {
    if(!user){
       return User.create({ userName:'Roberto', email:'test@test.com'});
    };
    return user;
})
.then((user) => {
    return user.createCart();
})
.then(() => {
    app.listen(port, () => {
        console.log(`on Port:${port}`), 
        console.log(`running on http://localhost:${port}`)
    })
})
.catch((err) => {
    console.log(err)
});


