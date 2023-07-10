const {Router} = require("express")
const router = Router()
const {createExport, getAllExports} = require("../controllers/exportsController")
const {auth} =require("../controllers/userController")


router.post("/create",auth,createExport)
router.get("/all",auth,getAllExports)

module.exports= router