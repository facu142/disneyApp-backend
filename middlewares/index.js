const  validarArchivo  = require("./validar-archivo");
const validarCampos  = require("./validar-campos");
const validarJWT  = require("./validar-jwt");

module.exports = {
    ...validarArchivo,
    ...validarCampos,
    ...validarJWT
}

