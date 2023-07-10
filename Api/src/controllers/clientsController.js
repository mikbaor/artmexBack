const { Client, User } = require("../connection/db");
const fs = require("fs-extra");
const { uploadImageClientTax } = require("../services/cloudinary");

const createClient = async (req, res) => {
  const {
    UserId,
    nombreDueño,
    taxID,
    direccion,
    telefono,
    tiendaNombre,
    NombreDelEncargado,
    state,
    city,
    email,
  } = req.body;

  let imageTaxId;
  let pathImage;

  try {
    if (req.file) {
      pathImage = req.file.path;
      imageTaxId = `${req.protocol}://${req.get("host")}/${pathImage.replace(
        /\\/g,
        "/"
      )}`;
    } else {
      imageTaxId = `${req.protocol}://${req.get("host")}/uploads/default.jpg}`;
    }

    const urlCloud = await uploadImageClientTax(pathImage);
    await fs.unlink(pathImage)

    const newClient = await Client.create({
      nombreDueño,
      taxID,
      direccion,
      telefono,
      tiendaNombre,
      NombreDelEncargado,
      state,
      city,
      email,
      imageTaxId: urlCloud.secure_url,
    });
    const user = await User.findByPk(UserId);

    await newClient.setUser(user);

    res.status(200).json({
      message: "cliente creado correctamente",
      newClientDetail: newClient,
    });
  } catch (error) {
    res.status(400).json({
      message: "error al crear cliente",
      errorDetail: error.message,
    });
  }
};

const getAllClients = async (req, res) => {
  const { id, tiendaNombre, NombreDelEncargado, state } = req.body;
  try {
    const whereClients = {};
    if (id) whereClients.id = id;
    if (tiendaNombre) whereClients.tiendaNombre = tiendaNombre;
    if (NombreDelEncargado)
      whereClients.NombreDelEncargado = NombreDelEncargado;
    if (state) whereClients.state = state;
    whereClients.stateController = true;

    const allFilterClients = await Client.findAll({
      where: whereClients,
      order: [["id", "DESC"]],
    });

    res.status(200).json(allFilterClients);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getClientById = async (req, res) => {
  const clientId = req.params.id;

  try {
    const client = await Client.findByPk(clientId);

    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    res.status(200).json(client);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error al obtener el cliente" });
  }
};

const deleteClient = async (req, res) => {
  const { clientId } = req.body;

  try {
    const client = await Client.findOne({ where: { id: clientId } });

    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    await client.update({ stateController: false });

    res.status(200).json({
      message: "cliente eliminado correctamente",
      deletedClientDetail: client,
    });
  } catch (error) {
    res.status(400).json({
      message: "error al eliminar cliente",
      errorDetail: error.message,
    });
  }
};

const modifyClient = async (req, res) => {
  const { clientId } = req.params;
  const { telefono, nombreDueño, NombreDelEncargado, email, direccion } =
    req.body;

  try {
    const client = await Client.findByPk(clientId);

    if (!client) {
      return res.status(404).json({
        message: "No se encontró el cliente",
      });
    }

    await client.update({
      telefono,
      nombreDueño,
      NombreDelEncargado,
      email,
      direccion,
    });

    res.status(200).json({
      message: "Se modificó el cliente correctamente",
      clientDetails: client,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Error al modificar el cliente",
      errorDetails: error.message,
    });
  }
};

module.exports = {
  createClient,
  getAllClients,
  getClientById,
  deleteClient,
  modifyClient,
};
