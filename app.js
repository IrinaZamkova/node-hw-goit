const express = require('express');
const cors =require("cors");
const Joi = require("joi");
const morgan = require('morgan');
const contactRouters = require('./routes/contact.routes');


PORT = 3000;
module.exports =class Server {
    constructor(){
        this.server = null;

    }
    start(){
        this.server = express();
        this.initMidddlewares();
        this.initRoutes();
        this.listen();
    }

    initMidddlewares(){
        this.server.use(cors());
        this.server.use(express.json());
        this.server.use(morgan('combined'));

    }

    initRoutes(){
        this.server.use('/contacts',contactRouters)

    }

    listen(){
        this.server.listen(PORT,()=>{
            console.log("Server is listeting on port: ",PORT);
        })
    }
}

