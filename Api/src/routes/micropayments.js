const {Router} = require("express")
const router = Router()
const {auth} = require("../controllers/userController")
const { createAbono, getAllAbonos } = require("../controllers/microPaymentsController")

router.post("/pay", auth, createAbono )
router.post("/all", auth, getAllAbonos)

module.exports = router