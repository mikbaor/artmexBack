const {Router} = require("express")
const router = Router()
const {auth} =require("../controllers/userController")
const {createTrailer, getAllPlacas, } = require("../controllers/trailerController")

router.post("/create", createTrailer)
router.get("/all", getAllPlacas)


module.exports = router