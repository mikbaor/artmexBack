# REGISTRO NUEVO ARTESANO

POST  http://localhost:3005/artisan/create

no puede ser null firstName y state

{
  "userId":1,
  "firstName": "Pruebfdfa",
  "lastName": "Do",
  "country": "New York",
  "state": "NY",
  "phone": "5551234567",
  "direccion": "123 Main St",
  "satId": "ABC123",
  "fiscalAddres": "456 Second St",
  "fiscalName": "Acme Inc.",
  "fiscalType": "Type A"
}


# TODOS LOS ARTESANOS FILTROS

GET  http://localhost:3005/artisan/all

puedes filtrar con las siguientes propiedades

{
  "firstName": "John",
  "id": 1,
  "state": "California"
}

# ARTESANO POR ID 

GET  http://localhost:3005/artisan/:id

lo mandamos por params


# BORRAR ARTESANO

POST http://localhost:3005/artisan/delete

{
  "artisantId":1
}

# MODIFICAR ARTESANO

POST http://localhost:3005/artisan/11

mandamos el id por params lo demas por body

{
  "state": "Ciudad de México",
  "phone": "5555555555"
}




