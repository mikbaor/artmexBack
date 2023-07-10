const {Router} = require("express")
const router = Router()
const {createChofers, getAllChofers} = require("../controllers/choferController")
const {auth} =require("../controllers/userController")
const { uploadImageChofer } = require("../controllers/uploadImagesController")


router.post("/create",uploadImageChofer.array("image", 2), createChofers)

router.get("/all", getAllChofers)

module.exports = router