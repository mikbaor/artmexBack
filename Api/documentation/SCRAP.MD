# CREAR NUEVO SCRAP

POST http://localhost:3005/scrap/create

{
  "userId": 1,
  "date": "2023-03-23 23:30:30",
  "totalScrap": 100,
  "microscrap": [
    {
      "productId": 1,
      "ammount": 10
    },
    {
      "productId": 2,
      "ammount": 10
    },
    {
      "productId": 3,
      "ammount": 10
    }
  ]
}

# TODOS LOS SCRAPS

GET http://localhost:3005/scrap/all

se filtran con el siguiente JSON

{
  "userId": 1,
  "fromDate": "2022-01-01",
  "toDate": "2022-12-31",
  "productId": 5,
  "nameProduct": "Tornillo"
}

# SCRAP POR ID

lo enviamos por params

GET http://localhost:3005/scrap/:id

# CSV SCRAP POR INTERVALO DE FECHAS
POST http://localhost:3005/scrap/csv

{
  "dateStart": "2022-01-01",
  "dateEnd": "2023-12-31"
}

