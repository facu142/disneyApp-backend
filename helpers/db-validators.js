const Character = require("../models/character")
const Genre = require("../models/genre")
const Movie = require("../models/movie")
const User = require("../models/user")

const emailExist = async (email = '') => {

    const userExists = await User.findOne({ where: { email } })

    if (userExists) {
        throw new Error(`El correo ${email} ya esta registrado`)
    }
}

const characterExistById = async (id) => {

    const characterExist = await Character.findOne({ where: { id } })

    if (!characterExist) {
        throw new Error(`No existe un personaje con id ${id}`);
    }
}

const characterNotExistByName = async (name) => {
    
    const characterExist = await Character.findOne({ where: {name} });
    
    if (characterExist){
        throw new Error(`Ya existe un personaje con nombre ${name}`);
    }
}


// Validar colecciones permitidas
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes(coleccion);

    if (!incluida) {
        throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`);
    }

    return true;
}

const movieExistById = async (id) => {

    const movieExist = await Movie.findOne({ where: { id } })

    if (!movieExist) {
        throw new Error(`No existe una pelicula con id ${id}`);
    }
}

const movieNotExistByTitle = async (title) => {

    const movieExist = await Movie.findOne({ where: { title } })

    if (movieExist) {
        throw new Error(`Ya existe una pelicula con el nombre ${title}`);
    };

}

const genreExistByName = async (genre) => {

    const genreExist = await Genre.findOne({ where: { name: genre } })

    if (!genreExist) {
        throw new Error(`No existe un genero con el nombre ${genre}`);
    }

}


module.exports = {
    emailExist,
    characterExistById,
    characterNotExistByName,
    coleccionesPermitidas,
    movieExistById,
    movieNotExistByTitle,
    genreExistByName
}

