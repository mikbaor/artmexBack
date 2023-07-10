# CREAR PEDIDO ORDER

POST http://localhost:3005/order/create

{
  "userId": 1,
  "date": "2023-05-01",
  "totalAmmount": 100,
  "microOrders": [
    {
      "productId": 1,
      "ammountRequired": 50
    },
    {
      "productId": 2,
      "ammountRequired": 50
    }
  ],
  "clientId": 1
}

# HACER REFILL DE ORDEN

POST http://localhost:3005/orders/refill

# CSV ORDENES POR INTERVALO DE FECHAS
POST http://localhost:3005/orders/csv

{
  "dateStart": "2022-01-01",
  "dateEnd": "2023-12-31"
}

# TODAS LAS ORDENES 
POST  http://localhost:3005/orders/all

{
  "dateStart": "2023-01-01",
  "dateEnd": "2023-01-31",
  "orderId": 1234,
  "productName": "example product"
}
