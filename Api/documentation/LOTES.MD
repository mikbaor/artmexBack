# REGISTRO DE LOTE NUEVO
POST  http://localhost:3005/lote/create

Todas son obligatorias y todas son string roleStack se debe usar roles establecidos 
en los modelos igual que permisos, estan predefinidos.
el formato de la fech es el siguiente YYYY-MM-DD HH:MM:SS
para poder registrar un lote debe existir el usuario que lo crea, el producto existente y el artesano
debemos enviarle el ID para asociarlo 

{
  "dateLote": "2022-03-28",
  "userId": 1,
  "totalAmmount": "100",
  "dateViatico": "2022-03-28",
  "mealViatico": 100,
  "fuelViatico": 50,
  "hotelViatico": 200,
  "casetasViatico": 100,
  "otherViatico": 50,
  "totalViatico": 500,
  "microLot": [
    {
      "productId": 1,
      "artisanId": 1,
      "typeBox": "adquisicion",
      "dateBox": "2022-03-28",
      "ammountBox": 20,
      "ammountProducBox": 5,
      "ammountProduct": 100,
      "adquisitionCost": 2000,
      "pricePerProduct": 20
    },
    {
      "productId": 2,
      "artisanId": 2,
      "typeBox": "adquisicion",
      "dateBox": "2022-03-28",
      "ammountBox": 30,
      "ammountProducBox": 10,
      "ammountProduct": 300,
       "adquisitionCost": 10,
       "pricePerProduct": 20
    }
  ]
}



# OBTENER TODOS LOTES FILTRADOS
GET http://localhost:3005/lote/all

se filtra por id y fecha

{
"id" : 1,
"date" : "2022-03-28"

}

# buscar lote por Id 

GET http://localhost:3005/lote/search/:id
BUSCA EL LOTE POR ID

# CSV LOTES POR INTERVALO DE FECHAS
POST http://localhost:3005/lote/csv

{
  "dateStart": "2022-01-01",
  "dateEnd": "2023-12-31"
}


