# CREAR VENTA

POST http://localhost:3005/sale/create
si incluyen el ratio dentro de el objeto se tomara ese encuenta y no el 
priceboxId que es el que obiene el ratio del estado


{
  "userId": 1,
  "date": "2023-05-07T15:23:00.000Z",
  "microBoxSales": [
    {
      "boxId": 1,
      "ratio": 2.6
      
    },
    {
      "boxId": 2,
      "ratio": 2.6
    },
    {
      "boxId": 3,
      "ratio": 2.6
    }
  ],
  "Tarimas": [
    { 
    "id":2,
    "ratio":2.5
    },
    { 
    "id":4,
    "ratio":"2.5"
    }
    ],
  "totalCost": 100,
  "clientId": 1,
  "totalAmmountPay": 100,
  "OrderExist": false,
  "priceboxId": 3
}

# Todas las ventas filtradas
POST http://localhost:3005/sale/all