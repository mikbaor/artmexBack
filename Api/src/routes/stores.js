const {Router} = require("express")
const router = Router()
const {createStores, filterAllStores, getStoreById, addSubstores} = require("../controllers/almacenesController")
const {auth} =require("../controllers/userController")


router.post("/create", auth, createStores)
router.post("/all", auth, filterAllStores)
router.get("/:id",auth, getStoreById)
router.post("/addStore", auth, addSubstores)

module.exports = router