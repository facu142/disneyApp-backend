const { response } = require("express");
const User = require('../models/user');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID)

const createUser = async (req, res = response) => {

    const { email, password, } = req.body;

    const usuario = await User.create({
        email,
        password
    });

    const msg = {
        to: email,
        from: 'disneyappnode@gmail.com',
        subject: 'Bienvenido a DisneyApp',
        text: 'Usuario creado correctamente'
    }

    sgMail.send(msg, function (err, info) {
        if (err) {
            console.log('Email no enviado');
        } else {
            console.log('Email enviado correctamente');
        }
    })

    return res.json({
        msg: 'Usuario creado correctamente',
        usuario
    })

}

module.exports = {
    createUser
}