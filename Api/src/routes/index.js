const { Router } = require("express");

//configuramos las rutas que se conectan
const user = require("./user");

const lote = require("./lote")
// const product = require("./product")

const stores = require("./stores")
const exportaciones = require("./exports")

// const client = require("./client")

const box = require("./box")
const tarima = require("./tarima")

const trailer = require("./trailer")
const traspaleo = require("./traspaleo")

// const sale = require("./sales")



//express
const app = Router();

//configuracion de las rutas que usan los middlewares
app.use("/user", user);


// app.use("/product",product)

app.use("/store", stores)
app.use("/exports", exportaciones)

// app.use("/client", client)

app.use("/box",box)
app.use("/tarima", tarima)

app.use("/trailer",trailer)
app.use("/traspaleo",traspaleo)

// app.use("/sale",sale)



module.exports = app;
