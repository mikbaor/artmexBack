const { Artisan, User, Product } = require("../connection/db");
const { Op } = require('sequelize');

const createArtisan = async (req, res) => {
  const {
    userId,
    firstName,
    lastName,
    country,
    state,
    phone,
    email,
    direccion,
    satId,
    fiscalAddres,
    fiscalName,
    fiscalType,
  } = req.body;

  try {
    const newArtisan = await Artisan.create({
      firstName,
      lastName,
      country,
      state,
      phone,
      email,
      direccion,
      satId,
      fiscalAddres,
      fiscalName,
      fiscalType,
    });

    const user = await User.findByPk(userId)

    newArtisan.setUser(user)

    res.status(202).json({
      message: "se creo correctamente el Artesano",
      artisandetails: newArtisan,
    });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({
      message: "error al crear el Artesano",
      errorDetails: error.message,
    });
  }
};

const getAllArtisans = async (req, res) => {
  const { firstName, id, state } = req.body;

  try {

    const whereArtisans = {}

    if(firstName) whereArtisans.firstName = { [Op.like]: `%${firstName}%` };
    if(id) whereArtisans.id = id
    if(state) whereArtisans.state = state
    whereArtisans.stateController = true

    const artisans = await Artisan.findAll({
      where:whereArtisans,
      order: [['id', 'DESC']]
    });

    res.status(200).json(artisans);
  } catch (error) {
    res.status(400).json({
      message: "Error no se pudieron obtener los Artesanos",
      errorDetai: error.message,
    });
  }
};

const getArtisanById = async (req, res) => {
  const artisanId = req.params.id;
  try {
    const artisan = await Artisan.findByPk(artisanId, {
      include: [
        {
          model: User,
          attributes: ["firstName", "userName", "phone", "email"],
        },
        {
          model:Product,
          attributes: ["id","name"]
        }
      ],
    });
    if (!artisan) {
      return res.status(404).json({
        message: "No se encontró un artesano con el id proporcionado",
      });
    }
    res.status(200).json(artisan);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Error al obtener el artesano",
      errorDetails: error.message,
    });
  }
};

const deleteArtisan = async (req, res) => {
  const { artisantId } = req.body;

  try {
    const artisan = await Artisan.findOne({ where: { id: artisantId } });

    if (!artisan) {
      return res.status(404).json({ message: "Artesano no encontrado" });
    }

    await artisan.update({ stateController: false });

    res.status(200).json({
      message: "Artesano eliminado correctamente",
      deletedClientDetail: artisan,
    });
  } catch (error) {
    res.status(400).json({
      message: "error al eliminar Artesano",
      errorDetail: error.message,
    });
  }
};

const modifyArtisan = async (req, res) => {
  const { id } = req.params;
  const {
      state,
      direccion,    
      phone,
      email,
      satId,
      fiscalAddres,
      fiscalType
  } = req.body;

  try {
    const artisan = await Artisan.findByPk(id);

    if (!artisan) {
      return res.status(404).json({
        message: "No se encontró el artesano",
      });
    }

    await artisan.update({
      state,
      direccion,   
      phone,
      email,
      satId,
      fiscalAddres,
      fiscalType
    });

    res.status(200).json({
      message: "Se modificó el artesano correctamente",
      artisandetails: artisan,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Error al modificar el artesano",
      errorDetails: error.message,
    });
  }
};



module.exports = {
  getAllArtisans,
  createArtisan,
  getArtisanById,
  deleteArtisan,
  modifyArtisan
};
