# CREATE PRICE

POST http://localhost:3005/priceBox/create

{
  "stateName": "California",
  "ratio": 1.2,
  "UserId": 123
}

# GET ALL CON FILTRO

sino envias nada llegan todos

POST http://localhost:3005/priceBox/all

{
  "stateName": "Chicago"
}

# MODIFY PRICE

POST http://localhost:3005/priceBox/modify

se busca el priceId y se modifica el ratio y el userId a modificar

{
  "UserId": 1,
  "ratio": 7,
  "priceId": 4
}



