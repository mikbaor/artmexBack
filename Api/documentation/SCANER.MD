# ENCONTRAR ULTIMO SCAN PENDING CAJA

GET http://localhost:3005/printer/findscan

# SETER SCAN COMO COMPLETE CAJA
POST http://localhost:3005/printer/donescan

mandamos el id de la caja que ya se imprimio la impresora

{
    "id":1
}

# ENCONTRAR ULTIMO SCAN PENDING TARIMA

GET http://localhost:3005/printer/findscantarima

# SETER SCAN COMO COMPLETE TARIMA
POST http://localhost:3005/printer/donescantarima

mandamos el id de la caja que ya se imprimio la impresora

{
    "id":1
}

