const { Router } = require("express");
const router = Router();
const { auth } = require("../controllers/userController");
const {
  createCarga,
  createUnloading,
  getAllCargas,
  getAllDescargas,
  getAllExports,
  csvCharges,
  csvDescargas,
  documentPdfShovelcharge,
} = require("../controllers/traspaleoController");

router.post("/charge", auth, createCarga);
router.post("/uncharge", auth, createUnloading);
router.post("/charges/all", auth, getAllCargas);
router.post("/uncharge/all", auth, getAllDescargas);
router.post("/all", auth, getAllExports);
router.post("/csvcharges", auth, csvCharges);
router.post("/csvuncharges", auth, csvDescargas);
router.post("/pdf/shovel", auth, documentPdfShovelcharge);

module.exports = router;
