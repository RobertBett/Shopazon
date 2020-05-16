const Sequeilze = require('sequelize');
const chalk = require('chalk');

const sequelize = new Sequeilze('node_complete', 'root', 'NODEparty2020', { 
    dialect : 'mysql', 
    host: 'localhost'
});
sequelize.authenticate()
.then((result) => {
    console.log(chalk.green('Connection to Sequelize Successful!'))
}).catch((err) => {
    console.log('Unable to connnect', err)
});
module.exports = sequelize;