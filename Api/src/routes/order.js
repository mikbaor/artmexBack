const {Router} = require("express")
const router = Router()
const {auth} = require("../controllers/userController")
const { createOrder, refillOrder, csvOrders, getAllOrders } = require("../controllers/ordersController")

router.post("/create", auth, createOrder )
router.post("/refill", auth, refillOrder )
router.post("/csv", auth, csvOrders)
router.post("/all", auth, getAllOrders)


module.exports = router