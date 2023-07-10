const {Router} = require("express")
const router = Router()
const {createTarima, getAllTarimas, getTarimaById, desentarimado} = require("../controllers/tarimaController")
const {auth} = require("../controllers/userController")



router.post("/create", auth, createTarima)

router.post("/all", getAllTarimas)

router.get("/:id",auth, getTarimaById)

router.post("/uncreate", auth, desentarimado )

module.exports = router