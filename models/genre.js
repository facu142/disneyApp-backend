const { DataTypes } = require('sequelize');
const db = require('../database/config');
const Movie = require('./movie');

const Genre = db.define('Genre', {
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
    }
})

module.exports = Genre;

