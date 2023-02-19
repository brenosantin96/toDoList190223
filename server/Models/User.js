const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
    // Model attributes are defined here

    email: {
        primaryKey: true,
        type: DataTypes.STRING
    },

    hashed_password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    // Other model options go here
    tableName: 'users',
    timestamps: false
});

module.exports = User;


// `sequelize.define` also returns the model
//console.log(User === sequelize.models.User); // true