const { DataTypes } = require('sequelize');
const db = require('../database/config');
const Character = require('./character');
const Movie = require('./movie');

const CharactersMovie = db.define('CharactersMovie', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
});

CharactersMovie.belongsTo(Movie, { as: 'movie' });
CharactersMovie.belongsTo(Character,  { as: 'character' });

module.exports = CharactersMovie;
