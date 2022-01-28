const { response } = require("express");
const { Op } = require("sequelize/dist");
const sequelize = require('sequelize');

const Character = require("../models/character");
const CharactersMovie = require("../models/charactersMovies");
const Genre = require("../models/genre");
const Movie = require("../models/movie");

const getCharacters = async (req, res = response) => {

    const { name, age, movies } = req.query;

    // Si no pasaron parametros de query mostrar todos
    if (!name && !age && !movies) {

        const characters = await Character.findAll();

        const reformatedCharacters = characters.map((character) => {
            return { name: character.name, image: character.image };
        });

        return res.status(200).json(reformatedCharacters);
    }

    if (name && age && movies) {
        const lookupValue = name.toLowerCase();

        const characters = await CharactersMovie.findAll({
            where: { movieId: movies },
            include: [{
                model: Character, as: 'character',
                where: {
                    age,
                    name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + lookupValue + '%')
                }
            }]
        })


        // return res.json(characters);


        const result = characters.map((char => char.character));

        return res.json(result);
    }


    if (name) {
        const lookupValue = name.toLowerCase();

        const characters = await Character.findAll({
            where: {
                name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + lookupValue + '%')
            }
        });

        return res.json(characters);
    }

    if (age) {
        const characters = await Character.findAll({ where: { age } })
        return res.json(characters)
    }

    if (movies) {

        const characters = await CharactersMovie.findAll({
            where: { movieId: movies },
            include: [{
                model: Character, as: 'character'
                // where: { characterId: movies }
            }]
        })


        const result = characters.map((char => {
            return char.character
        }));

        res.json(result)
    }

}

const getCharacter = async (req, res = response) => {

    const { id } = req.params;

    console.log(id);

    const character = await Character.findByPk(id);

    if (!character) {
        return res.status(400).json({
            msg: `No existe peronaje con id ${id}`
        });
    }

    // Obtener peliculas y series asociadas al personajes
    const associatedMovies = await CharactersMovie.findAll({ where: { characterId: id } });

    console.log(associatedMovies);

    let reformatedMovies = [];

    for (const movie of associatedMovies) {

        const movieDb = await Movie.findByPk(movie.movieId)

        if (movieDb) {
            const genreDb = await Genre.findByPk(movieDb.genreId)

            const reformatedMovie = {
                id: movieDb.id,
                image: movieDb.image,
                title: movieDb.title,
                creationDate: movieDb.creationDate,
                rating: movieDb.rating,
                genre: genreDb.name
            };
            reformatedMovies.push(reformatedMovie);
        }
    }

    res.json({
        id: character.id,
        name: character.name,
        image: character.image,
        age: character.age,
        weigth: character.weigth,
        history: character.history,
        associatedMovies: reformatedMovies
    });
}

const createCharacter = async (req, res = response) => {

    const { name, age, weigth, history, movies } = req.body;

    const data = {
        name,
        image: 'https://res.cloudinary.com/dosugr8hb/image/upload/v1642188364/fb4dje1ym8jsbsabreyw.jpg',
        age,
        weigth,
        history,
    };

    const character = await Character.create(data);

    let assosiatedMovies = [];

    if (movies) {
        for (const movie of movies) {

            // Verificar si las peliculas existen
            const movieDB = await Movie.findOne({ where: { title: movie } })

            if (movieDB) {
                // Guardar movieId y characterId en tabla "charactersMovies"
                assosiatedMovies.push(await CharactersMovie.create({
                    movieId: movieDB.id,
                    characterId: character.id
                }));
            };
        }
    }

    let reformatedMovies = []

    for (const movie of assosiatedMovies) {
        const movieDb = await Movie.findByPk(movie.movieId);
        reformatedMovies.push(movieDb);
    }


    res.json({
        msg: 'Se ha creado el personaje correctamente',
        character: {
            id: character.id,
            name: character.name,
            image: character.imag,
            age: character.age,
            weigth: character.weigth,
            history: character.history,
            assosiatedMovies: reformatedMovies
        }
    });

}

const editCharacter = async (req, res = response) => {

    const { id } = req.params;
    const { name, age, weigth, history, movies } = req.body;

    try {
        const character = await Character.findByPk(id);

        let newMovies = [];

        if (movies) {
            // Eliminar los anteriores peliculas asociadas
            let assosiatedMovies = await CharactersMovie.findAll({ where: { characterId: id } })

            for (const assosiatedMovie of assosiatedMovies) {
                await assosiatedMovie.destroy();
            }

            // Recorrer las nuevas peliculas del body 
            for (const movieName of movies) {

                const movieDb = await Movie.findOne({ where: { title: movieName } });

                if (movieDb) {
                    // Guardar peliculas asociadas validas
                    const movie = await CharactersMovie.create({
                        movieId: movieDb.id,
                        characterId: character.id
                    })
                    newMovies.push(movie);
                }
            }

        }

        let reformatedMovies = [];

        for (const movie of newMovies) {
            const mov = await Movie.findByPk(movie.movieId)
            reformatedMovies.push(mov)
        }

        await character.update({
            name,
            age,
            weigth,
            history,
        });

        res.json({
            msg: 'Se ha editado el personaje correctamente',
            character: {
                id: character.id,
                image: character.image,
                name: character.name,
                age: character.age,
                weigth: character.weigth,
                history: character.history,
                assosiatedMovies: reformatedMovies
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error'
        })
    }
}

const deleteCharacter = async (req, res = response) => {
    const { id } = req.params;

    try {
        const character = await Character.findByPk(id);

        // Borrar asociaciones con peliculas 
        const assosiatedMovies = await CharactersMovie.findAll({ where: { characterId: character.id } })

        if (assosiatedMovies) {
            for (const assosiatedMovie of assosiatedMovies) {
                await assosiatedMovie.destroy();
            }
        }

        await character.destroy();

        res.json({
            msg: 'Personaje borrado correctamente',
            character
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error'
        })
    }
}

module.exports = {
    getCharacters,
    getCharacter,
    createCharacter,
    editCharacter,
    deleteCharacter,
}
