# CREAR NUEVO REEMBOLSO 

POST http://localhost:3005/return/create

{
  "userId": 1,
  "date": "2022-04-01",
  "microReturns": [
    {
      "ammount": 10,
      "productId": 1,
      "artisanId": 1
    },
    {
      "ammount": 20,
      "productId": 2,
      "artisanId": 2
    }
  ]
}

# GET ALL REEMBOLSOS FILTRADO

POST http://localhost:3005/return/all

  {
  "userId": 1,
  "fromDate": "2022-01-01",
  "toDate": "2022-12-31",
  "productId": 1,
  "nameProduct": "Camisa"
}

# GET BY ID REEMBOLSO

obtenemos el reembolso por params

http://localhost:3005/return/:id

# CSV REEMBOLSOS POR INTERVALO DE FECHAS
POST http://localhost:3005/return/csv

{
  "dateStart": "2022-01-01",
  "dateEnd": "2023-12-31"
}