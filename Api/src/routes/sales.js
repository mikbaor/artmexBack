const { Router } = require("express")
const router = Router()
const { auth } = require("../controllers/userController")
const { createSale, getAllSales, csvSales, pdfTicketSale } = require("../controllers/salesController")
const { uploadImageSales } = require("../controllers/uploadImagesController")

router.post("/create", auth, uploadImageSales.array("images", 10), createSale)
router.post("/all", auth, getAllSales)
router.post("/csv", auth, csvSales)
router.post("/pdf/ticket", auth, pdfTicketSale)


module.exports = router