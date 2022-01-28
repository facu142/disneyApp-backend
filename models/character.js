const { DataTypes } = require('sequelize');
const db = require('../database/config');

const Character = db.define('Character', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    image: {
        type: DataTypes.STRING
    },
    age: {
        type: DataTypes.STRING
    },
    weigth: {
        type: DataTypes.STRING
    },
    history: {
        type: DataTypes.TEXT
    }
})

module.exports = Character;


