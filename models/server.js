const express = require('express');
const cors = require('cors');
const db = require('../database/config');
const fileUpload = require('express-fileupload');

var colors = require('colors');


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT

        this.paths = {
            auth: '/auth',
            usuarios: '/users',
            movies: '/movies',
            characters: '/characters',
            uploads: '/uploads',
            genres: '/genres'
        }

        // Conexion a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de la aplicacion
        this.routes();
    }

    async conectarDB() {

        require('../models/movie');
        require('../models/user');
        require('../models/character');
        require('../models/charactersMovies');
        require('../models/genre');

        try {
            await db.sync();
            console.log('********* Database online *********'.brightCyan);
        } catch (error) {
            throw new Error(error);
        }
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body

        this.app.use(express.json());

        // Directorio publico 
        this.app.use(express.static('public'));

        // FileUpload Carga de arhivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true // Siempre crea la carpeta si no existe
        }));

    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        // this.app.use(this.paths.usuarios, require('../routes/user'));
        this.app.use(this.paths.movies, require('../routes/movie'));
        this.app.use(this.paths.characters, require('../routes/character'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port);
        });
    }

}

module.exports = Server;
