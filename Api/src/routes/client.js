const {Router} = require("express")
const router = Router()
const {createClient, getAllClients, getClientById, deleteClient, modifyClient} = require("../controllers/clientsController")
const { auth } = require("../controllers/userController")
const { uploadImageClient } = require("../controllers/uploadImagesController")

router.post("/create", uploadImageClient.single("image") ,createClient)

router.post("/all",getAllClients)

router.get("/:id",auth, getClientById)

router.post("/delete",auth, deleteClient)

router.post("/modify",auth,modifyClient)

module.exports = router