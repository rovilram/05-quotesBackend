const express = require("express");
require("dotenv").config()

//CONEXIÓN CON MONGO
const { MongoClient } = require("mongodb");


const server = express();

//leemos del .env
const WEB_PORT = process.argv[3] || process.env.WEB_PORT || 8080;
const WEB_HOST = process.argv[2] || process.env.WEB_HOST || "localhost";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || 27017;
const DB_NAME = process.env.DB_NAME || "quotesdb";
const DB_COLLECTION_NAME = process.env.DB_COLLECTION_NAME || "quotes";

console.log(WEB_HOST, WEB_PORT, DB_HOST, DB_PORT, DB_NAME, DB_COLLECTION_NAME)


// Connection URI
const uri =
    `mongodb://${DB_HOST}:${DB_PORT}/` //?poolSize=20&writeConcern=majority`;

//métodos manejo datos

const getDBQuotes = async (collectionDB) => {
    console.log("AQUI ESTOY")
    let resultArr = [];
    try {
        console.log("MI COLECCIón", collectionDB );
        const findResult = await collectionDB.find({});
        //console.log(findResult)
        await findResult.forEach(res => {
            resultArr.push(res);
            console.log("paso por el foreach")
        })
        return resultArr;
    }
    catch {
        console.log("ERROR EN LA CONSULTA")
        //throw (new Error("Error al hacer consulta"));
    }
}

const putDBQuote = async (quote, collectionDB) => {
    try {
        const result = await collectionDB.insertOne(quote);
        console.log("Objeto insertado: ", result.ops)
        return result.ops; //devuelvo el objeto insertado
    }
    catch {
        throw new Error("Error al insertar:", quote)
    }
}

const pullDBQuote = async (id, quote, collectionDB) => {
    if (Number(id) === id) id = id.toString();
    const filter = { id: id };
    const updateDocument = {
        $set: {
            "id": quote.id,
            "name": quote.name,
            "quote": quote.quote
        },
    };

    try {
        const result = await collectionDB.updateOne(filter, updateDocument);
        console.log(`El objeto con id "${id}" se ha modificado`, result.modifiedCount);
        //devolvemos el número de registros modificados (debe ser 1)
        return result.modifiedCount;
    }
    catch {
        throw new Error("Error al modificar:", quote)
    }

}


const delDBQuote = async (id, collectionDB) => {
    if (Number(id) === id) id = id.toString();
    const filter = { id: id };


    try {
        const result = await collectionDB.deleteOne(filter);
        console.log(`El objeto con id "${id}" se ha borrado`, result);
        //devolvemos el número de registros borrados (debe ser 1)
        return result.deletedCount;
    }
    catch {
        throw new Error("Error al borrar el ID:", id)
    }
}


/* 
// Create a new MongoClient
 async function connectDB() {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    try {
        // Connect the client to the server
        await client.connect();
        // Establish and verify connection
        const db = client.db(DB_NAME);
        const collectionDB = db.collection(DB_COLLECTION_NAME)


        await db.command({ ping: 1 });
        console.log("Connected successfully to server"); 

      await getDBQuotes(collectionDB)
          .then(data=>console.log(data)) 
 */
/*         const quote = {
            id:"33",
            name: "roberto",
            quote: "me cago en mongo"
        } */

//       await putDBQuotes(quote, collectionDB);


/*         const quotePull = {
            id:"15",
            name: "sdfsdfsdf",
            quote: "odfgdfgdfgla k ashe"
        }
        const id=null;
        await pullDBQuote(id, quotePull, collectionDB) */
/* 
        const id=15;
        await delDBQuote(id, collectionDB); */
/* 

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
} 

connectDB().catch(console.dir); 
*/
// JSON support
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.get('/quotes', async (req, res) => {
    const urlDatabase = 'mongodb://localhost:27017/';
    
      MongoClient.connect(urlDatabase, (error, database) => {
        if (error) throw error;
    
        const collectionDB = database.db("quotesdb").collection("quotes");

        getDBQuotes(collectionDB)
            .then (data=>console.log(data))   
            .then(database.close())
        });
    });
    





/* 


    const client = new MongoClient(uri, { useUnifiedTopology: true });
    try {
        // Connect the client to the server
        await client.connect();
        // Establish and verify connection
        const db = client.db(DB_NAME);
        const collectionDB = db.collection(DB_COLLECTION_NAME)
        //console.log(db, collectionDB)

        await db.command({ ping: 1 });
        console.log("Connected successfully to server");

        getDBQuotes(collectionDB)
            .then(data => res.send(data))
            .catch(error => res.send(new Error("Error en la consulta")))


    }
    catch {
        console.log("ERROR")
    }
    finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }

});

 */

server.listen(WEB_PORT, WEB_HOST,
    () => console.log(`Servidor funcionando en el puerto ${WEB_PORT} de ${WEB_HOST}`)
);
