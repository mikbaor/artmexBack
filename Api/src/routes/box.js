const {Router} = require("express")
const router = Router()
const {auth} = require("../controllers/userController")
const {createBox, getAllBoxes, getBoxById, csvBoxes} = require("../controllers/boxControllers")

router.post("/create",auth,createBox)

router.post("/all", auth, getAllBoxes)

router.get("/:id", auth, getBoxById)

router.post("/csvboxes", auth, csvBoxes)

module.exports = router