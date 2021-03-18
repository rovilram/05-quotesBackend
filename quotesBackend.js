const express = require("express");
var MongoClient = require('mongodb').MongoClient;
const { v4: uuidv4 } = require('uuid');
require("dotenv").config()

//leemos del .env
const WEB_PORT = process.argv[3] || process.env.WEB_PORT || 8080;
const WEB_HOST = process.argv[2] || process.env.WEB_HOST || "localhost";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || 27017;
const DB_NAME = process.env.DB_NAME || "quotesdb";
const DB_COLLECTION_NAME = process.env.DB_COLLECTION_NAME || "quotes";
const urlDatabase = `mongodb://${DB_HOST}:${DB_PORT}/`;


const server = express();
server.use(express.urlencoded({ extended: true }));
server.use(express.json());



server.get('/quotes/:name*?', (req, res) => {
    let filter = {};
    const name = req.params.name;
    if (name) {
        filter = {
            name: new RegExp(name,"gi")
        }
    }
    console.log("FILTRO", filter)


    MongoClient.connect(urlDatabase,{ useUnifiedTopology: true },  function (err, db) {
        if (err) throw err;
        const dbo = db.db(DB_NAME);
        dbo.collection(DB_COLLECTION_NAME).find(filter).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.send(result)
            db.close();
        });
    });
})

server.post("/create", (req, res) => {
    const quote = req.body;
    quote.id = uuidv4();


    MongoClient.connect(urlDatabase, function (err, db) {
        if (err) throw err;
        const dbo = db.db(DB_NAME);
        dbo.collection(DB_COLLECTION_NAME).insertOne(quote, function (err, result) {
            if (err) throw err;
            console.log("1 documento insertado");
            res.send(result.ops) //devuelve lo insertado en la base de datos
            db.close();
        });
    });
})

server.put("/modify/:id", (req, res) => {
    const quote = req.body;
    const filter = { id: req.params.id };
    const newvalues = {
        $set: quote
    }
    MongoClient.connect(urlDatabase, function (err, db) {
        if (err) throw err;
        const dbo = db.db(DB_NAME);
        dbo.collection(DB_COLLECTION_NAME).updateOne(filter, newvalues, function (err, result) {
            if (err) throw err;
            console.log("1 documento modificado");
            res.send(result.result); //devolvemos objeto con nº de documentos alterados
            db.close();
        });
    });
})


server.delete("/delete/:id", (req, res) => {
    const filter = { id: req.params.id };


    MongoClient.connect(urlDatabase, function (err, db) {
        if (err) throw err;
        const dbo = db.db(DB_NAME);
        dbo.collection(DB_COLLECTION_NAME).deleteOne(filter, function (err, result) {
            if (err) throw err;
            console.log("1 documento borrado");
            res.send(result.result); //devolvemos objeto con nº de documentos borrados
            db.close();
        });
    });
})


server.listen(WEB_PORT, WEB_HOST,
    () => console.log(`Servidor funcionando en el puerto ${WEB_PORT} de ${WEB_HOST}`)
);

