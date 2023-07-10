# CREAR NUEVA CAJA

POST http://localhost:3005/box/create

{
  "high": 10,
  "wide": 20,
  "large": 30,
  "type": "empaque",
  "height": 5,
  "date": "2023-05-24T00:00:00",
  "userId": 1,
  "products": [
    {
      "id": 5,
      "ammount": 2
    },
    {
      "id": 6,
      "ammount": 3
    }
  ],
  "substoreId": 1,
  "printerId": 2,
  "detailOrder": "Sample detail"
}


# TODAS LAS CAJAS CON FILTRO

GET http://localhost:3005/box/all

Puedes enviar uno alguno o ninguno

{
    "boxId": 1,
    "ProductId": 1,
    "nameProduct": "Producto A",
    "userId": 3,
    "userName": "Juan" 
    "storeId" :1 
}

# CAJAS POR ID

se le pasa el id por params

  http://localhost:3005/box/:id


# DESCARGAR CSV POR INTERVALO DE FECHA CAJAS
POST http://localhost:3005/box/csvboxes

{
  "dateStart": "2022-01-01",
  "dateEnd": "2023-12-31"
}
