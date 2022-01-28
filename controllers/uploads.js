const { response } = require("express");

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const Character = require("../models/character");
const Movie = require("../models/movie");

const updateImageCharacterCloudinary = async (req, res = response) => {

    const { id } = req.params;

    const character = await Character.findByPk(id)

    // Limpiar imagenes previas
    if (character.image) {

        const nombreArr = character.image.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');

        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.archivo;

    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    character.image = secure_url;

    character.save();

    res.json({
        msg: 'Se ha actualizado la imagen correctamente',
        character
    });
}

const updateImageMovieCloudinary = async (req, res = response) => {

    const { id } = req.params;

    const movie = await Movie.findByPk(id)

    // Limpiar imagenes previas
    if (movie.image) {

        const nombreArr = movie.image.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');

        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.archivo;

    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    movie.image = secure_url;

    movie.save();

    res.json({
        msg: 'Se ha actualizado la imagen correctamente',
        movie
    });
}


module.exports = {
    updateImageCharacterCloudinary,
    updateImageMovieCloudinary
}