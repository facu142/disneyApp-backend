const { DataTypes } = require('sequelize');
const bcryptjs = require('bcryptjs')
const db = require('../database/config');

const User = db.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    }
}, {
    hooks: {
        beforeCreate(user) {
            user.password = bcryptjs.hashSync(user.password, bcryptjs.genSaltSync(10));
        }
    }
});

// Metodos personaizados 

User.prototype.verificarPassword = function(password) {
    return bcryptjs.compareSync(password, this.password);
}


module.exports = User;


