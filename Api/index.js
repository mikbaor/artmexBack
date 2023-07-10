const {conn} = require("./src/connection/db")
const app = require ("./src/App")
require("dotenv").config()
const {PORT} = process.env
const createRecordsFromData = require("./src/helpers/countriesEnum")

conn.sync().then(()=>createRecordsFromData()).then(()=> {
    app.listen(PORT, ()=>{
        console.log("*****  OK   ******")
        console.log(`listening at ${PORT}`)
    })}).catch((err)=>{
    console.log("+++++    ERROR   +++")
    console.log(err.message)
})
