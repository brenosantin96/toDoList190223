const { Sequelize } = require('sequelize');
require('dotenv').config();


const db = new Sequelize(
    process.env.DATABASE,
    process.env.USER,
    process.env.PASSWORD,
    {
        dialect: 'mysql',
        port: parseInt(process.env.DBPORT),
        // By default host is 'localhost'           
        host: process.env.HOST
    }
);

module.exports = db;