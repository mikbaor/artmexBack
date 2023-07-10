const { Trailer } = require("../connection/db");

const createTrailer = async (req, res) => {
  const { placaCode, colour, boxNumber, company } = req.body;
  try {
    const newTrailer = await Trailer.create({
      placaCode,
      colour,
      boxNumber,
      company,
    });

    res.status(200).json({
      message: "se creo correctamente el trailer",
      choferDetail: newTrailer,
    });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({
      message: "error en la creacion del trailer",
      errorDetails: error.message,
    });
  }
};

const getAllPlacas = async (req, res) => {
  try {
    const trailers = await Trailer.findAll({
      attributes: ["placaCode", "id"],
    });
    res.status(200).json({
      message: "Lista de placas de trailers",
      trailers: trailers,
    });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({
      message: "Error al obtener la lista de placas de trailers",
      errorDetails: error.message,
    });
  }
};

module.exports = {
  createTrailer,
  getAllPlacas,
};
