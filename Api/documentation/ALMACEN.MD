# CREAR ALMACEN (STORE)

http://localhost:3005/store/create

{
  "name": "Bodega Central",
  "subStoreNames": ["Subalmacén 1", "Subalmacén 2", "Subalmacén 3"],
  "country": "México",
  "state": "Ciudad de México",
  "city": "Ciudad de México",
  "address": "Calle Ejemplo #123",
  "userId": 1
}


# TODOS LOS ALMACENES (FILTRO)

GET http://localhost:3005/store/all

puedes filtrar con las siguientes propiedades

{
  "name": "Producto 1",
  "subStoreName": "Tienda 1",
  "id": 1
}

# ALMACEN POR ID

GET http://localhost:3005/store/:id

se manda el id por params

# AÑADIR SUBALMACENES 

POST http://localhost:3005/store/addStore

{
"substoreName":"almcenPrueba",
"storeId":1
}