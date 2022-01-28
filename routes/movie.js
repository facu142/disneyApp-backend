const { Router, response } = require('express');
const { getMovies, createMovie, getMovie, editMovie, deleteMovie } = require('../controllers/movie');
const { check, query } = require('express-validator');
const { validateDateFormat } = require('../helpers/validate-date-format');
const { validarCampos, validarJWT } = require('../middlewares');
const { movieExistById, movieNotExistByTitle, genreExistByName } = require('../helpers/db-validators');

const router = Router();

// Listar o buscar peliculas
router.get('/', [
    validarJWT,
    validarCampos
], getMovies)


// Listar detalle pelicula 
router.get('/:id', [
    validarJWT,
    check('id').custom(movieExistById),
    validarCampos
], getMovie)


// Crear pelicula
router.post('/', [
    validarJWT,
    check('title', 'el campo title es obligatorio').not().isEmpty(),
    check('creationDate', 'el campo creationDate es obligatorio').not().isEmpty(),
    check('rating', 'el campo rating es obligatorio').not().isEmpty(),
    check('rating', 'el campo rating debe ser un numero entre 1 y 5').isFloat({ min: 1, max: 5 }),
    check('genre', 'el campo genre es obligatorio').not().isEmpty(),
    check('creationDate').custom(validateDateFormat),
    check('title').custom(movieNotExistByTitle),
    check('genre').custom(genreExistByName),
    validarCampos
], createMovie)

// Editar pelicula 
router.put('/:id', [
    validarJWT,
    check('id').custom(movieExistById),
    check('title', 'el campo title es obligatorio').not().isEmpty(),
    check('creationDate', 'el campo creationDate es obligatorio').not().isEmpty(),
    check('rating', 'el campo rating es obligatorio').not().isEmpty(),
    check('rating', 'el campo rating debe ser un numero entre 1 y 5').isFloat({ min: 1, max: 5 }),
    check('genre', 'el campo genre es obligatorio').not().isEmpty(),
    check('creationDate').custom(validateDateFormat),
    check('genre').custom(genreExistByName),
    validarCampos
], editMovie)

// Eliminar pelicula
router.delete('/:id', [
    validarJWT,
    check('id').custom(movieExistById),
    validarCampos
], deleteMovie)

module.exports = router