const { Router } = require("express");
const router = Router();
const {
  createProduct,
  modifyProduct,
  filterAllProducts,
  deleteProduct,
  getProductsWithoutBox,
} = require("../controllers/productController");
const { auth } = require("../controllers/userController");
const { uploadImageProduct } = require("../controllers/uploadImagesController");

router.post("/create", auth, uploadImageProduct.single("image"), createProduct);
router.post("/modify/:id", auth,uploadImageProduct.single("image"), modifyProduct);

router.post("/all", auth, filterAllProducts);
router.post("/delete", auth, deleteProduct);

router.get("/onlyunitary", auth, getProductsWithoutBox);

module.exports = router;
