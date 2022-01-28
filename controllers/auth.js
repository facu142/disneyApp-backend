const { response } = require("express");
const bcryptjs = require('bcryptjs');
const User = require("../models/user");
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req, res=response) => {

    const {email, password} = req.body;

    try {
        
        const user = await User.findOne({where: {email}})

        if(!user){
            return res.status(401).json({
                msg: 'Email y/o password no son correctos'
            })
        }
        
        const validPassword = bcryptjs.compareSync(password, user.password)
        
        if(!validPassword){
            return res.status(401).json({
                msg: 'Email y/o password no son correctos'
            })
        }

        // Generar Token
        const token = await generarJWT(user.id)

        res.json({
            user,
            token
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador',
        })
    }

}





module.exports = {
    login
}
