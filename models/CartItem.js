const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Cart = sequelize.define('cartItem',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: Sequelize.INTEGER,
    price: Sequelize.INTEGER,
});

module.exports = Cart;