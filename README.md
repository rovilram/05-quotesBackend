-Construye una simple CRUD app con Node, Express y MongoDB:

* PARA ESTE EJERCICIO NO TRABAJAREMOS CON FRONTEND, TODAS LAS PRUEBAS DEBES REALIZARLAS EN POSTMAN.

1. npm init e instala las dependencias node, express, nodemon, dotenv y mongodb en tu proyecto.

2. Monta tu servidor.

3. Conecta con MongoDB, usando el método MongoClient:

https://www.w3schools.com/nodejs/nodejs_mongodb.asp

4. Crea tu database y tu collection en MongoDB por consola. Esta es la única vez que usarás la consola para realizar el ejercicio, para el resto de operaciones usaremos Postman.

5. Conecta MongoClient en el tratamiento de cada endpoint con Express.

Conexión con MongoClient

Ejemplo de petición POST que recibe un objeto monster por el body del paquete http, para hacer un insert en la BD:

const urlDatabase = 'mongodb://localhost:27017/';
...

server.post('/monsters', (req, res) => {
  let monster = req.body;

  MongoClient.connect(urlDatabase, (error, database) => {
    if (error) throw error;

    database.db("tu-db-quotes").collection("tu-collection")
      .insertOne(monster, (error, data) => {
        if (error) throw error;
      
        // ...
      
        database.close();
    });
  });
});

( Fuente: https://www.w3schools.com/nodejs/nodejs_mongodb_insert.asp )


6. Primer endpoint GET /quotes, devolverá el contenido completo de la database. Además aceptará query params opcionales que permitan recibir la petición de un sólo documento filtrando por el campo "name".
 
7. Segundo endpoint POST /create, creará nuevo contenido en la database. Recibirá por request body un campo "name" y un campo "quote". En este endpoint generaremos un "id" para almacenar junto con los datos anteriores. Puedes buscar un paquete npm para generar automáticamente un uuid.

8. Tercer endpoint PUT /modify/:id, buscará por el id recibido el documento a actualizar y lo actualizará con la información recibida por body.
 
9. Cuarto endpoint DELETE /delete/:id, buscará por el id recibido un documento y eliminará.

BONUSTRACK: Mejorar el proyecto aplicando orientación a objetos.
