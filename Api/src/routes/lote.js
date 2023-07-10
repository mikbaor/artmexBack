const {Router} = require("express")
const {createLote, getAllLotes,getLotById, csvLotes} = require("../controllers/loteController")
const router = Router()
const {auth} =require("../controllers/userController")

// post 
router.post("/create",auth, createLote )

//get
router.post("/all",auth,getAllLotes)
router.get("/search/:id",auth, getLotById)
router.post("/csv",auth, csvLotes)


module.exports = router