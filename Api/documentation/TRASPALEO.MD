
# CREAR UNA CARGA


http://localhost:3005/traspaleo/charge

# INTERNACIONAL

si es tipo INTERNACIONAL se manda asi utilizmos la palabra export

{
  "boxes": [
    {
      "id": 1
    },
    {
      "id": 2
    }
  ],
  "tarimas": [
    {
      "id": 1
    },
    {
      "id": 2
    }  
  ],
  "userId": 1,
  "choferId": 1,
  "trailerId": 1,
  "almacenId": 1,
  "date": "2023-04-20",
  "typeTrip": "export",
  "tarimasAmmount": 10,
  "boxesAmmount": 20,
  "observations":"observaciones",
  "depositStoreId":"store de deposito",
  "totalWeight":34.4
}

# NACIONAL

si es tipo NACIONAL se manda asi utilizmos la palabra nacional

{
  "boxes": [
    {
      "id": 1
    },
    {
      "id": 2
    }
  ],
  "tarimas": [
    {
      "id": 1
    },
    {
      "id": 2
    }  
  ],
  "userId": 1,
  "choferId": 1,
  "trailerId": 1,
  "almacenId": 1,
  "date": "2023-04-20",
  "typeTrip": "nacional",
  "tarimasAmmount": 10,
  "boxesAmmount": 20,
  "observations":"observaciones",
  "depositStoreId":"store de deposito",
}

# INTERNO

si es tipo INTERNO se manda asi utilizmos la palabra interno
y ademas vamos mandar el id del Substore que lo vamos a mover en depositId

{
  "boxes": [
    {
      "id": 1
    },
    {
      "id": 2
    }
  ],
  "tarimas": [
    {
      "id": 1
    },
    {
      "id": 2
    }  
  ],
  "userId": 1,
  "almacenId": 1,
  "depositId": 2,
  "date": "2023-04-20",
  "typeTrip": "interno",
  "tarimasAmmount": 10,
  "boxesAmmount": 20,
  "observations":"observaciones"
}

# CREAR UNA DESCARGA

POST http://localhost:3005/traspaleo/uncharge

{
  "boxes": [
    {
      "id": 1
    },
    {
      "id": 2
    }
  ],
  "tarimas": [
    {
      "id": 1
    },
    {
      "id": 2
    }
  ],
  "userId": 1,
  "choferId": 1,
  "trailerId": 1,
  "storeId": 1,
  "depositId": 1,
  "date": "2023-05-18",
  "cargasId": 1,
  "tarimasAmmount": 10,
  "boxesAmmount": 20
}



# TODAS LAS CARGAS FILTRADO SOLO EXPORTS
http://localhost:3005/traspaleo/charges/all
exportStatus solo tiene estatus complete or pending

{
  "nameUser": "Juan",
  "choferName": "Pedro",
  "placaCode": "AB123CD",
  "dateExit": "2023-04-26T10:30:00.000Z",
  "typeTrip": "local",
  "exportStatus": "pending",
  "storeName": "Tienda A"
}

# TODAS LAS DESCARGAS FILTRADO
http://localhost:3005/traspaleo/uncharge/all
exportStatus solo tiene estatus complete or pending


  {
    "nameUser": "Juan",
    "choferName": "Pedro",
    "trailerPlacaCode": "ABCD1234",
    "date": "2023-04-26T12:30:00Z",
    "storeName": "Tienda ABC"
}


# DESCARGAR CSV POR INTERVALO DE FECHA CARGAS
POST http://localhost:3005/traspaleo/csvcharges

{
  "dateStart": "2022-01-01",
  "dateEnd": "2023-12-31"
}

# DESCARGAR CSV POR INTERVALO DE FECHA DESCARGAS
POST http://localhost:3005/traspaleo/csvuncharges

{
  "dateStart": "2022-01-01",
  "dateEnd": "2023-12-31"
}

 