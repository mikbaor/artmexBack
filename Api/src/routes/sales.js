const { Router } = require("express")
const router = Router()
const { auth } = require("../controllers/userController")
const { createSale, getAllSales, csvSales, pdfTicketSale80mm, pdfTicketSale58mm, emailDetailSale80mm, emailDetailSale58mm } = require("../controllers/salesController")
/*const { uploadImageSales } = require("../controllers/uploadImagesController")*/

/*router.post("/create", auth, uploadImageSales.array("images", 10), createSale)*/
router.post("/create", auth, createSale)
router.post("/all", auth, getAllSales)
router.post("/csv", auth, csvSales)
router.post("/pdf/ticket/80mm", auth, pdfTicketSale80mm)
router.post("/pdf/ticket/58mm", auth, pdfTicketSale58mm)

router.post("/email/ticket/80mm", auth, emailDetailSale80mm)
router.post("/email/ticket/58mm", auth, emailDetailSale58mm)


module.exports = router