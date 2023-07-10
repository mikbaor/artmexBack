const { Router } = require("express");
const router = Router();
const { auth } = require("../controllers/userController");
const {
  findLastBoxEt,
  createPrinter,
  donePrint,
  findLastScan,
  doneScan,
  donePrintTarima,
  doneScanTarima,
  findLastScanTarima,
  setPendingReimpress,
} = require("../controllers/printerZebraController");

router.post("/findticket", findLastBoxEt);
router.post("/create", auth, createPrinter);
router.post("/done", donePrint);
router.get("/findscan", auth, findLastScan);
router.post("/donescan", auth, doneScan);
router.post("/donetarima", donePrintTarima);
router.post("/donescantarima", auth, doneScanTarima);
router.get("/findscantarima", auth, findLastScanTarima);
router.post("/reimpression",auth, setPendingReimpress)

module.exports = router;
