const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Product = sequelize.define('product',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: Sequelize.TEXT,
    price:{
        type:Sequelize.DOUBLE,
        allowNull:false
    },
    imageUrl:{
        type:Sequelize.TEXT,
        allowNull:false
    },
    description:{
        type: Sequelize.TEXT,
        allowNull:false
    }
});
module.exports = Product;