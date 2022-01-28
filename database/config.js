const Sequelize = require('sequelize');

const db = new Sequelize(process.env.CLEARDB_DATABASE_URL, {
// const db = new Sequelize('14-js-server-challenge', 'root', 'root', {
    
    host: 'localhost',
    dialect: 'mysql',
    port: '3306',
    operatorAliases: false,
    define: {
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = db;

