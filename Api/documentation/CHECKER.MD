# CHECAR ENTRADA 

post http://localhost:3005/check/entry/:id
mandamos id del usuario por params
{
  "date": "2023-05-19",
  "entryTime": "09:00:00",
  "word":"palabra secreta"
}
# CHECAR SALIDA DE COMIDA

post http://localhost:3005/check/exitmeal/:id
mandamos id del usuario por params
{
  "date": "2023-05-18",
  "exitMealTime": "12:00:00"
}

# CHECAR REGRESO DE COMIDA 

post http://localhost:3005/check/entry/:id
mandamos id del usuario por params
{
  "date": "2023-05-18",
  "arriveMealTime": "17:00:00"
}
# CHECAR SALIDA 

post http://localhost:3005/check/exitmeal/:id
mandamos id del usuario por params
{
  "date": "2023-05-18",
  "exitTime": "19:00:00"
}

# TODOS LOS REGISTROS POR FECHA E IDUSER

post http://localhost:3005/check/all

{ 
"entryStatus":true,  
"exitMealStatus":false, 
"arriveMealStatus":true, 
"exitStatus":true, 
"userId":7 
} 

# REGISTRAR NUEVA PALABRA DEL DIA

POST http://localhost:3005/check/word

{
  "word": "palabra secreta"
}

# OBTENER PALABRA DEL DIA

POST http://localhost:3005/check/getword






