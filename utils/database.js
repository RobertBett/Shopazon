const Sequeilze = require('sequelize');

const sequelize = new Sequeilze('node-complete', 'root', 'NODEparty2020', { 
    dialect : 'mysql', 
    host: 'localhost'
});
sequelize.authenticate()
.then((result) => {
    console.log('Connection to Sequelize Successful!')
}).catch((err) => {
    console.log('Unable to connnect', err)
});
module.exports = sequelize;