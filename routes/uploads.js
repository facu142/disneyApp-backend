const { Router } = require('express');
const { check } = require('express-validator');

const { characterExistById, movieExistById } = require('../helpers');
const { updateImageCharacterCloudinary, updateImageMovieCloudinary } = require('../controllers/uploads');

const { validarArchivoSubir, validarCampos, validarJWT } = require('../middlewares');

const router = Router();

// Actualizar Imagen de un personaje
router.put('/characters/:id', [
    validarJWT, 
    validarArchivoSubir,
    check('id').custom(characterExistById),
    validarCampos
], updateImageCharacterCloudinary)

// Actualizar Imagen de una pelicula
router.put('/movies/:id', [
    validarJWT, 
    validarArchivoSubir,
    check('id').custom(movieExistById),
    validarCampos
], updateImageMovieCloudinary)

module.exports = router;
