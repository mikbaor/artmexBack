# CREAR EXPORTACION

POST http://localhost:3005/exports/create

shovel es el id de la carga a la queremos agregar los costo de exportacion

{
  "userId": 1,
  "aduanalCost": 5120,
  "arrivalDate": "2022-03-28",
  "montacargasCost": 100,
  "otherCost": 50,
  "shovelchargeId":1
}


# FILTRO EXPORTACIONES

GET http://localhost:3005/exports/all

Si mandas VACIO el heaader TE LLEGARAN TODAS LAS EXPORTACIONES o 
las puedes filtrar con las siguientes propiedades, fistName es el nombre del Chofer

{
  "dateDepart": "2023-04-01T08:00:00Z",
  "arrivalDate": "2023-04-01T16:00:00Z",
  "id": "1234",
  "placaCamion": "ABC-123",
  "firstName": "Juan"
}