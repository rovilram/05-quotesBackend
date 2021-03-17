//Al final rehice el código y no las he llegado a usar.
// Las dejo aquí como referencia


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


