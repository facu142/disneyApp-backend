const { Router } = require('express');
const { login } = require('../controllers/auth');
const { createUser } = require('../controllers/user');
const { emailExist } = require('../helpers/db-validators');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/register', [
    check('email', 'El email no es valido').isEmail(),
    check('email').custom(emailExist),
    // check('password', 'El password deber ser de 7 letras o mas').isLength({ min: 7 }),
    check("password", "La contraseña debe ser una combinacion de una letra mayuscula, una letra minuscula, un digito y minimo 8 caracteres, maxima longitud 20").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i"),
    validarCampos
], createUser)


router.post('/login', [
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio'),
    validarCampos
], login)

module.exports = router
