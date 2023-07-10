# CREAR NUEVO ABONO

POST http://localhost:3005/abono/pay

Seleccionamos el saleId que queremos agregarle a un abono

{
  "date": "2023-05-09",
  "payAmmount": 2,
  "saleId": 24
}

# TODOS LOS ABONOS FILTRADO

POST http://localhost:3005/abono/all

{
  "paymentId":1
}