# CREAR NUEVA TARIMA

http://localhost:3005/tarima/create

{
  "date": "2023-04-01",
  "weight": 100,
  "height": 200,
  "wide":200,
  "large":300,
  "userId": 1,
  "substoreId": 1,
  "printerId": 1
  "boxes": [
    {
      "id": 21
    },
    {
      "id": 28
    },
    {
      "id": 35
    }
  ]
}

# TODAS LAS TARIMAS CON FILTRO

POST http://localhost:3005/tarima/all

{
  "tarimaId": 1,
  "userId": 2,
  "userName": "johndoe",
  "boxId": 3
  "storeId" :1 
}


# TARIMA BY ID 

pasamos id por Params

GET http://localhost:3005/tarima/:id


# DESENTARIMAR CAJAS

POST http://localhost:3005/tarima/uncreate

{
  "boxes": [6, 7, 8],
  "boxesAmmount": 3,
  "date": "2023-05-05",
  "depositId": 1,
  "UserId": 1
}

