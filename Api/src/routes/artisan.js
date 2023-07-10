const { Router } = require("express");
const router = Router();
const {
  createArtisan,
  getAllArtisans,
  getArtisanById,
  deleteArtisan,
  modifyArtisan,
} = require("../controllers/artisanController");
const { auth } = require("../controllers/userController");

router.post("/create", auth, createArtisan);
router.post("/all", auth, getAllArtisans);
router.get("/:id", auth, getArtisanById);
router.post("/delete", auth, deleteArtisan);
router.post("/modify/:id", auth, modifyArtisan);

module.exports = router;
