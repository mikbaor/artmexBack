const { Store, User, Box, Tarima, Substore } = require("../connection/db");
const { Op } = require("sequelize");
const { ZPL_LOGO, madeInMexico } = require("../helpers/logo");
const createStores = async (req, res) => {
  const { name, subStoreNames, country, state, city, address, userId } =
    req.body;

  try {
    const newStore = await Store.create({
      name,
      country,
      state,
      city,
      address,
    });

    const storeNew = await Store.findByPk(newStore.id);
    let addressStore;
    const detail = (index1, index2) => {
      return newStore.dataValues.address.slice(index1, index2).length > 0
        ? newStore.dataValues.address.slice(index1, index2)
        : "";
    };

    const ZPL_STR = `
    ^XA
    ^FO100,100^ATN,80,120^FWB^FD${storeNew.dataValues.name}^FS
    ^FO700,100^A0N,35,50^FWB^FDStorage Label^FS
    ^FO75,850^A0N,70,50^FWB^FDArt Mex^FS
    ^FO150,765^A0N,70,50^FWB^FDImportsCorp^FS
    {{logo}}
    ^FO225,100^GB4,1000,2^FS
    ^FO355,500^A0N,40,40^FWB^FDSTR${storeNew.dataValues.id}^FS
    ^FO400,500^BQ,2,10^FDQA,STR${storeNew.dataValues.id}^FS
    ^FO450,1000^A0N,30,40^FWB^FDAdrees:^FS
    ^FO500,850^A0N,16,24^FWB^FD${detail(0, 26)}^FS
    ^FO524,850^A0N,16,24^FWB^FD${detail(26, 51)}^FS
    ^FO548,850^A0N,16,24^FWB^FD${detail(51, 76)}^FS
    ^FO572,850^A0N,16,24^FWB^FD${detail(101, 126)}^FS
    ^FO596,850^A0N,16,24^FWB^FD${detail(126, 151)}^FS
    ^FO620,850^A0N,16,24^FWB^FD${detail(151, 176)}^FS
    ^FO644,850^A0N,16,24^FWB^FD${detail(176, 201)}^FS

    ^XZ`; // Código ZPL que deseas envia
    const etiquetaSnSalto = ZPL_STR.replace(/\n/g, "");

    const ZPL_LOGO_CONCAT = etiquetaSnSalto.replace("{{logo}}", ZPL_LOGO);

    const user = await User.findByPk(userId);

    const newSubstores = await Promise.all(
      subStoreNames.map(async (subStoreName) => {
        let newSubstore;
        if (user) {
          newSubstore = await Substore.create({
            name: subStoreName,
            UserId: user.id,
          });
        } else {
          newSubstore = await Substore.create({
            name: subStoreName,
          });
        }
        await newSubstore.setUser(user);
        return newSubstore;
      })
    );

    await Store.update(
      { etiqueta: ZPL_LOGO_CONCAT },
      { where: { id: newStore.id } }
    );
    await newStore.setUser(user);
    await newStore.setSubstores(newSubstores);

    const store = await Store.findByPk(newStore.id, {
      include: [
        {
          model: User,
          attributes: ["firstName", "userName", "phone", "email"],
        },
        {
          model: Substore,
        },
      ],
    });

    res.status(200).json({
      message: "se creo correctamente el Store",
      storeDetail: store,
    });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({
      message: "error en la creacion de la bodega",
      errorDetails: error.message,
    });
  }
};

const filterAllStores = async (req, res) => {
  const { name, subStoreName, id } = req.body;

  try {
    let whereStore = {};
    let whereSubstore = {};

    if (name) whereStore.name = { [Op.like]: `%${name}%` };
    if (id) whereStore.id = id;
    if (subStoreName) whereSubstore.name = { [Op.like]: `%${subStoreName}%` };

    let storeFilter = await Store.findAll({
      attributes:["id",
      "name",
      "country",
      "state",
      "city",
      "address",
      "isImpress",
      "reimpressionAmmount"],
      where: whereStore,
      include: [
        {
          model: Substore,
          where: whereSubstore,
        },
      ],
      order: [["id", "DESC"]],
    });
    res.status(200).json(storeFilter);
  } catch (error) {
    res.status(400).json({
      message: "Error no se pudieron obtener los almcenes",
      errorDetai: error.message,
    });
  }
};

const getStoreById = async (req, res) => {
  const { id } = req.params;

  try {
    const store = await Store.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["firstName", "userName", "phone", "email"],
        },
        {
          model: Substore,
        },
      ],
    });

    if (!store) {
      return res.status(404).json({ message: "No se encontró la bodega" });
    }

    res.status(200).json(store);
  } catch (error) {
    console.log(error.message);
    res.status(404).json({
      message: "error al obtener la bodega",
      errorDetails: error.message,
    });
  }
};

const addSubstores = async (req, res) => {
  const { substoreName, storeId } = req.body;

  try {
    const storeB = await Store.findByPk(storeId);
    const newSubstore = await Substore.create({ name: substoreName });
    await storeB.addSubstores(newSubstore);
    const storeA = await Store.findByPk(storeId, {
      attributes:["id","name"],
      include: {
        model: Substore,
      },
    });

    res.status(200).json(storeA);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = {
  createStores,
  filterAllStores,
  getStoreById,
  addSubstores,
};
