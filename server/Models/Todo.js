const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');

const Todo = sequelize.define('Todo', {
    // Model attributes are defined here

    id: {
        primaryKey: true,
        type: DataTypes.STRING
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    progress: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    user_email: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    // Other model options go here
    tableName: 'todos',
    timestamps: false
});

module.exports = Todo;


// `sequelize.define` also returns the model
//console.log(User === sequelize.models.User); // true