const { Chofer, Chofersphotos, conn } = require("../connection/db");
const { uploadImageChofers } = require("../services/cloudinary");
const fs = require("fs-extra")


const createChofers = async (req, res) => {
  const { dateRegister, firstName, lastName, license, company } = req.body;

   const transaction = await conn.transaction();
  let pathImage1, pathImage2, imageOver, imageBack, imagenesPath;

  

  try {
    const newChofer = await Chofer.create(
      {
        dateRegister,
        firstName,
        lastName,
        license,
        company,
      },
      { transaction }
    );

    if (req.files) {
      pathImage1 = req.files[0].path;
      pathImage2 = req.files[1].path;
      imageOver = `${req.protocol}://${req.get("host")}/${pathImage1.replace(
        /\\/g,
        "/"
      )}`;
      imageBack = `${req.protocol}://${req.get("host")}/${pathImage2.replace(
        /\\/g,
        "/"
      )}`;

      console.log(req.files)

    const url1 =  await  uploadImageChofers(pathImage1)
    const url2  = await uploadImageChofers(pathImage2)

       imagenesPath = await Chofersphotos.create(
        {
          path1: url1.secure_url,
          path2: url2.secure_url,
        },
        { transaction }
      );

      await fs.unlink(pathImage1)
      await fs.unlink(pathImage2)

      await newChofer.setChofersphoto(imagenesPath, { transaction });
    }

    await transaction.commit();


    const chofer = await Chofer.findByPk(newChofer.id,{
      include:[
        {
          model:Chofersphotos
        }
      ]
    })

    res.status(200).json({
      message: "se creo correctamente el Chofer",
      choferDetail: chofer,
    });
  } catch (error) {
    console.log(error.message);
    if (transaction !== "commit" && transaction.finished !== "rollback") {
      await transaction.rollback();
    }
    res.status(404).json({
      message: "error en la creacion del Chofer",
      errorDetails: error.message,
    });
  }
};

const getAllChofers = async (req, res) => {
  try {
    const chofers = await Chofer.findAll({
      include:[
        {
          model:Chofersphotos
        }
      ]
    });
    res.status(200).json({
      message: "Lista de todos los choferes",
      choferDetails: chofers,
    });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({
      message: "Error al obtener la lista de choferes",
      errorDetails: error.message,
    });
  }
};

module.exports = {
  createChofers,
  getAllChofers,
};
