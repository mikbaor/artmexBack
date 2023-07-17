const { Router } = require("express");

//configuramos las rutas que se conectan
const user = require("./user");
const exportaciones = require("./exports")
const traspaleo = require("./traspaleo")
const sale = require("./sales")

//express
const app = Router();
app.use("/user", user);
app.use("/exports", exportaciones)
app.use("/traspaleo", traspaleo)
app.use("/sale", sale)





module.exports = app;
