const { response } = require("express");
const sequelize = require('sequelize');
const Movie = require("../models/movie");
const Genre = require("../models/genre");
const CharactersMovies = require('../models/charactersMovies');
const Character = require('../models/character');

const getMovies = async (req, res = response) => {

    const { name, genre, order } = req.query;

    // Si no pasan parametros de query, listar todas las peliculas
    if (!name && !genre && !order) {
        const movies = await Movie.findAll();

        const reformatedMovies = movies.map((movie) => {
            return {
                title: movie.title,
                image: movie.image,
                creationDate: movie.creationDate
            };
        });

        res.json(reformatedMovies);
    }

    // Validar orden (ASC | DESC)
    if (order) {
        const orderUpper = order.toUpperCase();

        if (orderUpper != 'ASC' && orderUpper != 'DESC') {
            return res.status(400).json({
                msg: `Ingrese un orden valido ( ASC | DESC )`
            });
        }
    }

    if (name && genre && order) {
        const lookupValue = name.toLowerCase();

        const movies = await Movie.findAll({
            where: {
                title: sequelize.where(sequelize.fn('LOWER', sequelize.col('title')), 'LIKE', '%' + lookupValue + '%'),
                genreId: genre
            },
            order: [
                ['creationDate', order]
            ]
        });

        return res.json(movies)

    }

    if (name && genre) {
        const lookupValue = name.toLowerCase();

        const movies = await Movie.findAll({
            where: {
                title: sequelize.where(sequelize.fn('LOWER', sequelize.col('title')), 'LIKE', '%' + lookupValue + '%'),
                genreId: genre
            }
        });

        return res.json(movies)

    }

    if (name && order) {
        const lookupValue = name.toLowerCase();

        const movies = await Movie.findAll({
            where: {
                title: sequelize.where(sequelize.fn('LOWER', sequelize.col('title')), 'LIKE', '%' + lookupValue + '%'),
            },
            order: [
                ['creationDate', order]
            ]
        });
        return res.json(movies)
    }

    if (genre && order) {
        const movies = await Movie.findAll({
            where: {
                genreId: genre
            },
            order: [
                ['creationDate', order]
            ]
        });
        return res.json(movies)
    }

    if (name) {
        const lookupValue = name.toLowerCase();

        const movies = await Movie.findAll({
            where: {
                title: sequelize.where(sequelize.fn('LOWER', sequelize.col('title')), 'LIKE', '%' + lookupValue + '%')
            }
        });

        return res.json(movies);

    }

    if (genre) {
        const movies = await Movie.findAll({ where: { genreId: genre } })
        return res.json(movies)
    }

    if (order) {

        const movies = await Movie.findAll({
            order: [
                ['creationDate', order]
            ]
        })

        return res.json(movies)

    }

}

const createMovie = async (req, res = response) => {

    const { title, creationDate, rating, genre, characters } = req.body;

    const movieDb = await Movie.findOne({ where: { title } })

    const genreDb = await Genre.findOne({ where: { name: genre } });

    if (movieDb) {
        return res.status(400).json({
            msg: `La pelicula: ${movieDb.title} ya existe en la base de datos`
        });
    };

    if (!genreDb) {
        return res.status(400).json({
            msg: `No existe el genero ${genre} en la base de datos`
        });
    };

    // Guardar pelicula en tabla movies

    const data = {
        title,
        image: 'https://res.cloudinary.com/dosugr8hb/image/upload/v1642188364/fb4dje1ym8jsbsabreyw.jpg',
        creationDate,
        rating,
        genreId: genreDb.id,
    };

    const movie = await Movie.create(data);

    let assosiatedCharacters = [];

    if (characters) {
        for (const characterName of characters) {

            const characterDb = await Character.findOne({ where: { name: characterName } });

            if (characterDb) {
                // Guardar personajes asociados
                const character = await CharactersMovies.create({
                    movieId: movie.id,
                    characterId: characterDb.id
                })

                assosiatedCharacters.push(character);
            }
        }
    }

    let reformatedCharacters = []

    for (const character of assosiatedCharacters) {
        const char = await Character.findByPk(character.characterId)
        reformatedCharacters.push(char)
    }

    res.json({
        msg: 'Se ha creado la pelicula correctamente',
        movie: {
            id: movie.id,
            title: movie.title,
            image: movie.image,
            creationDate: movie.creationDate,
            rating: movie.rating,
            genre: genreDb.name,
            assosiatedCharacters: reformatedCharacters
        }
    });

}

const getMovie = async (req, res = response) => {

    const { id } = req.params;

    const movie = await Movie.findOne({ where: { id } })

    const assosiatedCharacters = await CharactersMovies.findAll({ where: { movieId: id } })

    let reformatedCharacters = []

    for (const character of assosiatedCharacters) {
        const char = await Character.findByPk(character.characterId)
        reformatedCharacters.push(char)
    }

    const genreDb = await Genre.findByPk(movie.genreId)

    res.status(200).json({
        id: movie.id,
        image: movie.image,
        title: movie.title,
        creationDate: movie.creationDate,
        rating: movie.rating,
        genre: genreDb.name,
        assosiatedCharacters: reformatedCharacters
    });
}

const editMovie = async (req, res = response) => {

    const { id } = req.params;
    const { title, creationDate, rating, genre, characters } = req.body;

    try {
        const movie = await Movie.findByPk(id);
        const newGenre = await Genre.findOne({ where: { name: genre } });

        let newCharacters = [];

        if (characters) {
            // Eliminar los anteriores personajes
            let assosiatedCharacters = await CharactersMovies.findAll({ where: { movieId: id } })

            for (const assosiatedCharacter of assosiatedCharacters) {
                await assosiatedCharacter.destroy();
            }

            // Guardar los nuevos personajes
            for (const characterName of characters) {

                const characterDb = await Character.findOne({ where: { name: characterName } });

                if (characterDb) {
                    // Guardar personajes asociados
                    const character = await CharactersMovies.create({
                        movieId: movie.id,
                        characterId: characterDb.id
                    })

                    newCharacters.push(character);
                }
            }

        }

        let reformatedCharacters = [];

        for (const character of newCharacters) {
            const char = await Character.findByPk(character.characterId)
            reformatedCharacters.push(char)
        }

        await movie.update({
            title,
            creationDate,
            rating,
            genreId: newGenre.id,
        });

        res.json({
            msg: 'Se ha editado la pelicula correctamente',
            movie: {
                id: movie.id,
                image: movie.image,
                title: movie.title,
                creationDate: movie.creationDate,
                rating: movie.rating,
                genre: newGenre.name,
                assosiatedCharacters: reformatedCharacters
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error'
        })
    }
}

const deleteMovie = async (req, res = response) => {
    const { id } = req.params;

    try {
        const movie = await Movie.findByPk(id);

        // borrar asociaciones con personajes 

        const assosiatedCharacters = await CharactersMovies.findAll({ where: { movieId: movie.id } })

        if (assosiatedCharacters) {
            for (const assosiatedCharacter of assosiatedCharacters) {
                await assosiatedCharacter.destroy();
            }
        }

        // borrar pelicula
        await movie.destroy();

        res.json({
            msg: 'Pelicula borrada correctamente',
            movie
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error'
        })
    }

}



module.exports = {
    getMovies,
    getMovie,
    createMovie,
    editMovie,
    deleteMovie
}