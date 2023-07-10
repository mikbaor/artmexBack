
# CREAR PRODUCTO
POST http://localhost:3005/product/create

el envio de peso, adquisitionCost, averageCost, nyPrice, chicPrice son tipo float pueden llevar decimales

El ammount se inicia en 0 sino se envia, ese se setea cuando se registra un lote
No pueden ser null name y tipo

*la imagen como propiedad debe llamarse image en el html name

{
  "userId":1,  
  "name": "Prto",
  "tipo": "Electrónica",
  "peso": 2.5,
  "colorPrimario": "Negro",
  "colorSecundario": "Blanco" 
}


# MODIFICAR PRODUCTO
POST http://localhost:3005/product/modify/:id
multiform-data 
envias igual una imagen

{
  "tipo":"nueva descripcion"
}



# FILTRAR Y OBTENER TODOS LOS PRODUCTOS
GET http://localhost:3005/product/all

{
  "name": "casuela",
  "tipo": "ceramica roja",
  "colorPrimario": "Negro"
}
