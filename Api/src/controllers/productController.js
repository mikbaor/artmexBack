const Jimp = require("jimp");
const { Product, User } = require("../connection/db");
const { uploadImageProducts } = require("../services/cloudinary");
const fs = require("fs-extra");

const createProduct = async (req, res) => {
  const { userId, name, tipo, peso, colorPrimario, colorSecundario } = req.body;

  let imageProduct;
  let pathImage;
  let newProduct;

  try {
    if (req.file) {
      pathImage = req.file.path;
      imageProduct = `${req.protocol}://${req.get("host")}/${pathImage.replace(
        /\\/g,
        "/"
      )}`;

      const targetWidth = 420;
      const targetHeight = 420;

      await Jimp.read(pathImage)
        .then((image) => {
          image.resize(targetWidth, targetHeight);
          return image.writeAsync(pathImage);
        })
        .catch((err) => {
          console.error(err);
        });

      const { secure_url } = await uploadImageProducts(pathImage);

      await fs.unlink(pathImage);

      const newProduct = await Product.create({
        userId,
        name,
        tipo,
        peso,
        colorPrimario,
        colorSecundario,
        imageProduct: secure_url,
      });
      const user = await User.findByPk(userId);

      newProduct.setUser(user);

      res.status(200).json({
        message: "Producto creado correctamente",
        productDetail: newProduct,
      });
    } else {

      const newProduct = await Product.create({
        userId,
        name,
        tipo,
        peso,
        colorPrimario,
        colorSecundario,
        imageProduct: "https://res.cloudinary.com/armex/image/upload/v1688322356/Products/xk7nv5nuxquoh1r8tpaa.png",
      });
      const user = await User.findByPk(userId);

      newProduct.setUser(user);

      res.status(200).json({
        message: "Producto creado correctamente",
        productDetail: newProduct,
      });
    }
    
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      mesage: "error al crear el Producto",
      errorDetail: error.mesage,
    });
  }
};

const modifyProduct = async (req, res) => {
  const productId = req.params.id;
  const { tipo } = req.body;
  let imageProduct;
  let pathImage;

  try {
    if (req.file) {
      pathImage = req.file.path;
      imageProduct = `${req.protocol}://${req.get("host")}/${pathImage.replace(
        /\\/g,
        "/"
      )}`;

      const targetWidth = 420;
      const targetHeight = 420;

      await Jimp.read(pathImage)
        .then((image) => {
          image.resize(targetWidth, targetHeight);
          return image.writeAsync(pathImage);
        })
        .catch((err) => {
          console.error(err);
        });

      const { secure_url } = await uploadImageProducts(pathImage);

      await fs.unlink(pathImage);

      const updateProduct = await Product.update(
        { tipo, imageProduct: secure_url },
        { where: { id: productId } }
      );

      res.status(200).json({
        message: "Producto modificado correctamente",
        productDetail: updateProduct,
      });
    } else {
      const updateProduct = await Product.update(
        { tipo },
        { where: { id: productId } }
      );

      res.status(200).json({
        message: "Producto modificado correctamente",
        productDetail: updateProduct,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      mesage: "error al modificar el Producto",
      errorDetail: error.mesage,
    });
  }
};

const filterAllProducts = async (req, res) => {
  const { name, tipo, colorPrimario } = req.body;

  try {
    const whereProducts = {};

    if (name) whereProducts.name = name;
    if (tipo) whereProducts.tipo = tipo;
    if (colorPrimario) whereProducts.colorPrimario = colorPrimario;
    whereProducts.stateController = true;

    const products = await Product.findAll({
      where: whereProducts,
      order: [["id", "DESC"]],
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({
      message: "Error no se pudieron obtener los productos",
      errorDetai: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  const { productId } = req.body;

  try {
    const product = await Product.findOne({ where: { id: productId } });

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    await product.update({ stateController: false });

    res.status(200).json({
      message: "producto eliminado correctamente",
      deletedClientDetail: product,
    });
  } catch (error) {
    res.status(400).json({
      message: "error al eliminar producto",
      errorDetail: error.message,
    });
  }
};

const getProductsWithoutBox = async (req, res) => {
  const { id } = req.body;

  try {
    const products = await Product.findAll({
      where: {
        boxId: null,
      },
    });

    res.status(200).json({
      message: "Productos sueltos encontrados",
      products: products,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Error",
      errorDetails: error.message,
    });
  }
};

module.exports = {
  createProduct,
  modifyProduct,
  filterAllProducts,
  deleteProduct,
  getProductsWithoutBox,
};
