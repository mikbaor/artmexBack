# REGISTRO DE USUARIOS 

POST  http://localhost:3005/user/register

Todas son obligatorias y todas son string roleStack se debe usar roles establecidos 
en los modelos igual que permisos, estan predefinidos.

IMPORTANTE solo enviar los permisos que tiene el usuario, sino envias los demas en 
automatico se marcan false

{
  "firstName": "John",
  "lastName": "Doe",
  "userName": "johndoe",
  "civilSituation": "single",
  "phone": "1234567890",
  "email": "johndoe@example.com",
  "password": "password123",
  "image": "profile.jpg",
  "country": "United States",
  "state": "California",
  "zipCode": "12345",
  "address": "123 Main St",
  "satId": "SAT123",
  "schedule": "9 AM - 5 PM",
  "emergencyPhone": "0987654321",
  "sons": 0,
  "inDate": "2023-05-18",
  "outDate": null,
  "roleStack": "admin",
  "permissionStack": {
    "createUser": true,
    "getAllUsers": true
  }
}

# todos los permisos que puedes enviar

  {
  "permissionStack": {
    "seeUsers": false,
    "createUsers": false,
    "editUsers": false,
    "deleteUsers": false,
    "seeArtisans": false,
    "createArtisans": false,
    "editArtisans": false,
    "deleteArtisans": false,
    "seeProducts": false,
    "createProducts": false,
    "editProducts": false,   
    "seeLotes": false,
    "createLotes": false,
    "seeBoxes": false,
    "createBoxes": false,
    "seeTarimas": false,
    "createTarimas": false,
    "uncreateTarimas": false,
    "seeScrapt": false,
    "createScrapt": false,
    "seeReturns": false,
    "createReturns": false,
    "seeStore": false,
    "createStore": false,
    "addSubStore": false,   
    "deleteStore": false,  
    "seeCharges": false,  
    "createCharges": false,
    "seeTransits": false,
    "createExport": false,
    "seeUnCharges": false,
    "createUnCharges": false,
    "seeSales": false,
    "createSales": false,
    "seePays": false,
    "createPays": false,
    "seePays": false,
    "createPays": false,
    "seePedidos": false,
    "createPedidos": false,
    "seeClients": false,
    "createClients": false,
    "editClients": false,    
    "seeDashboard": false,
    "createReprint": false,
  }
}

# OBTENER TODOS USUARIOS 
GET http://localhost:3005/user/all

ejemplo del array que trae
[
  {
    "id": 1,
    "firstName": "Nombre",
    "lastName": "Apellido",
    "civilSituation": "Soltero",
    "phone": "2228642822",
    "email": "nombre@email.com",
    "password": "pass",
    "image": "urlImagen",
    "state": true,
    "RoleId": 1,
    "AddressId": 1,
    "Address": {
      "id": 1,
      "country": "pais",
      "state": "estado",
      "zipCode": "72000",
      "address": "direccion",
      "createdAt": "2023-03-16T05:28:25.572Z",
      "updatedAt": "2023-03-16T05:28:25.572Z"
    },
    "Permissions": [
      {
        "id": 1,
        "permissionStack": "editor",
        "UserId": 1
      }
    ],
    "Role": {
      "id": 1,
      "roleStack": "administrador"
    }
  }
]

# MODIFICAR USUARIO POR SU ID 
PUT  http://localhost:3005/user/update/:id

Mandas los datos que deseas cambiar y en el params va el ID del usurario a modificar

{
  "id": 1,
  "civilSituation": "Casado",
  "phone": "123456789",
  "country": "México",
  "state": "Ciudad de México",
  "zipCode": "12345",
  "address": "Calle Ejemplo 123",
  "satId": "ClaveSat123",
  "emergencyPhone": "987654321",
  "sons": "2",
  "roleStack": "etiquetador"
  "password":"nuevopass"
}

# OBTENER USUARIO POR SU ID 
GET http://localhost:3005/user/search/:id

Obtendras un objeto de usuario y sus relaciones como este

{
  "id": 1,
  "firstName": "Nombre",
  "lastName": "Apellido",
  "civilSituation": "Soltero",
  "phone": "2228642822",
  "email": "nombre@email.com",
  "password": "pass",
  "image": "urlImagen",
  "state": true,
  "RoleId": 1,
  "AddressId": 1,
  "Address": {
    "id": 1,
    "country": "pais",
    "state": "estado",
    "zipCode": "72000",
    "address": "direccion"
  }, 
  "Role": {
    "id": 1,
    "roleStack": "administrador"
  }
}
# BORRADO LOGICO DE USUARIO POR SU ID 

DELETE http://localhost:3005/user/delete/:id

cambias su state a false y ya no aparecera en la lista de usuarios

{
  "stateLogic":false
}

# FILTRADO DE USERS

GET http://localhost:3005/user/filter

Aqui si puedes recuperar todos los usuarios incluso los que esten eliminados

Este seria el template del filtro puedes enviar una o varias propiedades para recuperar los usuarios
el userName y el firstName tiene la opcion de que se pueden buscar por parecido ejemplo si mandas Pat buscara nombres
que inicien con esas letra.

{
    "roleStack": "administrador",
     "country":  "Mexico",     
     "userName": "usuarioEjmplo",
     "firstName": "name",
     "state": true
}

# USER LOGIN
POST http://localhost:3005/user/login

retorna un token para hacer peticiones  la base de datos de todos los post, gets y puts
se guarda en el local storage o redux persist por seguridad el token tiene una duracion de 4h
pero se puede modificar el tiempo 

{
    "userName": "nombreUsuario",
    "password": "pass"
}

# CSV USERS POR INTERVALO DE FECHAS
POST http://localhost:3005/user/csv

{
  "dateStart": "2022-01-01",
  "dateEnd": "2023-12-31"
}


# MODIFICAR PERMISOS DE USUARIOS 

enviamos el id del usuario por params en url

POST http://localhost:3005/user/updpermission/:id

solo enviamos los que deseamos modificar setear true o false

{
        
        "seeUsers": true,
        "createUsers": true,
        "editUsers": true,
        "deleteUsers": false,
        "seeArtisans": false,
        "createArtisans": false,
        "editArtisans": false,
        "deleteArtisans": false,
        "seeProducts": false,
        "createProducts": false,
        "editProducts": false,
        "seeLotes": false,
        "createLotes": false,
        "seeBoxes": false,
        "createBoxes": false,
        "seeTarimas": false,
        "createTarimas": false,
        "uncreateTarimas": false,
        "seeScrapt": false,
        "createScrapt": false,
        "seeReturns": false,
        "createReturns": false,
        "seeStore": false,
        "createStore": false,
        "addSubStore": false,
        "deleteStore": false,
        "seeCharges": false,
        "createCharges": false,
        "seeTransits": false,
        "createExport": false,
        "seeUnCharges": false,
        "createUnCharges": false,
        "seeSales": false,
        "createSales": false,
        "seePays": false,
        "createPays": false,
        "seePrices": false,
        "createPrices": false,
        "seeClients": false,
        "createClients": false,
        "editClients": false,
        "seeDashboard": false,
        "createReprint": false,
        "seePedidos": false,
        "createPedidos": false,
        
      }