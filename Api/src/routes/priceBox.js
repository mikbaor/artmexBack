const {Router} = require("express")
const router = Router()
const {auth} = require("../controllers/userController")
const { createPrice, getAllPrices, modifyPrice } = require("../controllers/priceBox")


router.post("/create", auth, createPrice )
router.post("/all", auth, getAllPrices )
router.post("/modify", auth, modifyPrice)


module.exports = router