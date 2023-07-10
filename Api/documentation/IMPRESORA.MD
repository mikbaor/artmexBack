# ENCONTRAR ULTIMA ETIQUETA PENDING

GET http://localhost:3005/printer/findticket

# CREAR IMPRESORA
POST http://localhost:3005/printer/create

{
    "name":"nombre de impresora"
}

# SETER TICKET COMO IMPRESO LA CAJA
POST http://localhost:3005/printer/done

mandamos el id de la caja que ya se imprimio la impresora

{
    "id":1
}


# SETER TICKET COMO IMPRESO LA TARIMA
POST http://localhost:3005/printer/doneTarima

mandamos el id de la tarima que ya se imprimio la impresora

{
    "id":1
}