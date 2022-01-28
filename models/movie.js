const { DataTypes } = require('sequelize');
const db = require('../database/config');
const Genre = require('./genre');

const Movie = db.define('Movie', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    image: {
        type: DataTypes.STRING
    },
    title: {
        type: DataTypes.STRING
    },
    creationDate: {
        type: DataTypes.DATEONLY
    },
    rating: {
        type: DataTypes.FLOAT,
        default: true
    },
});

Movie.belongsTo(Genre, { as: 'genre' });

module.exports = Movie;
