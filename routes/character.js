const { Router } = require("express");
const { check } = require('express-validator')
const { getCharacters, createCharacter, editCharacter, deleteCharacter, getCharacter } = require("../controllers/character");
const { characterExistById, characterNotExistByName } = require("../helpers/db-validators");
const { validarCampos, validarJWT } = require("../middlewares");

const router = Router();

// Obtener personajes 
router.get('/', [
    validarJWT
], getCharacters)

// Obtener detalle personaje 
router.get('/:id', [
    validarJWT,
    check('id').custom(characterExistById),
    validarCampos
], getCharacter)

// Crear personaje
router.post('/', [
    validarJWT,
    check('name', 'El campo name es obligatorio').not().isEmpty(),
    check('age', 'El campo age es obligatorio').not().isEmpty(),
    check('weigth', 'El campo weigth es obligatorio').not().isEmpty(),
    check('history', 'El campo history es obligatorio').not().isEmpty(),
    // check('movies', 'El campo movies es obligatorio').not().isEmpty(),
    check('name').custom(characterNotExistByName),
    validarCampos
], createCharacter)

// Editar personaje
router.put('/:id', [
    validarJWT,
    check('id').custom(characterExistById),
    validarCampos
], editCharacter)

// Eliminar personaje
router.delete('/:id', [
    validarJWT,
    check('id').custom(characterExistById),
    validarCampos
], deleteCharacter)


module.exports = router;