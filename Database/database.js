const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    pool: {
        max: 10, 
        min: 0,
        acquire: 30000, 
        idle: 10000,   
    }
});


module.exports = sequelize;
