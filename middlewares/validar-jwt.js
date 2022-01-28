const { response, request } = require('express')
const jwt = require('jsonwebtoken');
const User = require('../models/user');


const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {

        const { id } = jwt.verify(token, process.env.SECRETORPUBLICKEY);

        // Leer el usuario que corresponde al uid
        const usuario = await User.findOne({ where: { id } })

        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe en DB'
            })
        }

        req.usuario = usuario;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'token no valido'
        })

    }
}


module.exports = {
    validarJWT
};



