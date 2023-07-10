const {
  //modelos
  User,
  Product,
  Artisan,
  Box,
  Viatico,
  Lote,
  MicroLot,
  ArtisanProduct,
} = require("../connection/db");
const { conn } = require("../connection/db");
const { Op } = require("sequelize");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const createLote = async (req, res) => {
  const {
    dateLote,
    userId,
    totalAmmount,
    dateViatico,
    mealViatico,
    fuelViatico,
    hotelViatico,
    casetasViatico,
    otherViatico,
    totalViatico,
    microLot,
  } = req.body;

  const transaction = await conn.transaction();
 
  try {
    const newUser = await User.findByPk(userId, { transaction });

    const newLote = await Lote.create(
      {
        date: dateLote,
        totalAmmount,
      },
      { transaction }
    );

    const newViatico = await Viatico.create(
      {
        date: dateViatico,
        meal: mealViatico ? mealViatico : 0,
        fuel: fuelViatico ? fuelViatico : 0,
        hotel: hotelViatico ? hotelViatico : 0,
        casetas: casetasViatico ? casetasViatico : 0,
        other: otherViatico ? otherViatico : 0,
        total: totalViatico ? totalViatico : 0,
      },
      { transaction }
    );

    let totalMicroLotAmmount = 0;
    let sumToAveragecost = 0;

    for (const lot of microLot) {
      totalMicroLotAmmount += parseInt(lot.ammountProduct);
    }

    if (totalMicroLotAmmount > 0) {
      sumToAveragecost =
        parseFloat(totalViatico) / parseInt(totalMicroLotAmmount);
      sumToAveragecost = parseFloat(sumToAveragecost.toFixed(2));
    }

    const productSum = {};
    const newMicroLots = await Promise.all(
      microLot.map(async (lot) => {
        let newProduct = await Product.findByPk(lot.productId, {
          transaction,
        });

        if (!newProduct) {
          await transaction.rollback();
          return res.status(404).json({
            message: `El producto con ID ${lot.productId} no existe`,
          });
        }

        if (!productSum[lot.productId]) {
          productSum[lot.productId] = parseInt(newProduct.ammount);
        }
        productSum[lot.productId] += lot.ammountProduct;
        newProduct.ammount = productSum[lot.productId];
        await newProduct.save({ transaction });

        const newArtisan = await Artisan.findByPk(lot.artisanId, {
          transaction,
        });

        const newBox = await Box.create(
          {
            type: lot.typeBox,
            date: lot.dateBox,
            ammount: lot.ammountBox,
            isImpress:"",
            isScaned:"",
          },
          { transaction }
        );

        const newMicroLot = await MicroLot.create(
          {
            productMicroLotAmmount: lot.ammountProduct,
            adquisitionCost: lot.adquisitionCost,
            productEachBox: lot.ammountProducBox,
            pricePerProduct: lot.pricePerProduct,
          },
          { transaction }
        );

        const [artisanProduct, created] = await ArtisanProduct.findOrCreate({
          where: { ArtisanId: newArtisan.id, ProductId: newProduct.id },
          transaction,
        });

        if (!created) {
          await newArtisan.addProduct(newProduct, { transaction });
          await newProduct.addArtisan(newArtisan, { transaction });
        }

        await newMicroLot.setProduct(newProduct, { transaction });
        await newMicroLot.setArtisan(newArtisan, { transaction });
        await newMicroLot.setBox(newBox, { transaction });

        const microLots = await MicroLot.findAll({
          where: {
            ProductId: lot.productId,
          },
          attributes: [
            [
              conn.fn("sum", conn.col("pricePerProduct")),
              "totalAdquisitionCost",
            ],
            [conn.fn("count", conn.col("*")), "totalMicroLots"],
          ],
          raw: true,
          transaction,
        });

        const totalAdquisitionCost = microLots[0].totalAdquisitionCost;
        const totalMicroLots = microLots[0].totalMicroLots;

        const averageCost =
          Math.round(
            (totalAdquisitionCost / totalMicroLots) * 10 + sumToAveragecost
          ) / 10;

        newProduct.averageCost = averageCost;
        await newProduct.save({ transaction });
        await newMicroLot.setLote(newLote, { transaction });

        return newMicroLot;
      })
    );

    await newLote.setViatico(newViatico, { transaction });
    await newLote.setUser(newUser, { transaction });
    await transaction.commit();

    const lote = await Lote.findByPk(newLote.id, {
      include: [
        {
          model: User,
          attributes: ["firstName", "userName", "phone", "email"],
        },
        {
          model: Viatico,
        },
        {
          model: MicroLot,
          attributes: [
            "productMicroLotAmmount",
            "adquisitionCost",
            "productEachBox",
            "pricePerProduct",
          ],
          include: [
            {
              model: Product,
              attributes: [
                "id",
                "name",
                "tipo",
                "peso",
                "colorPrimario",
                "averageCost",
              ],
            },
            {
              model: Artisan,
              attributes: ["id", "firstName", "phone", "state", "direccion"],
            },
            {
              model: Box,
              attributes: ["id", "type", "date", "ammount"],
            },
          ],
        },
      ],
    });

    res.status(202).json(lote);
  } catch (error) {
    if (
      transaction.finished !== "commit" &&
      transaction.finished !== "rollback"
    ) {
      await transaction.rollback();
    }
    console.log(error.message);
    res
      .status(404)
      .json({ message: "error al crear el lote", detail: error.message });
  }
};

const getAllLotes = async (req, res) => {
  const { id, date } = req.body;

  const where = {};

  if (id) where.id = id;
  if (date) where.date = date;

  try {
    const lotes = await Lote.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ["firstName", "userName", "phone", "email"],
        },
        {
          model: Viatico,
        },
        {
          model: MicroLot,
          attributes: ["productMicroLotAmmount", "adquisitionCost"],
          include: [
            {
              model: Product,
              attributes: [
                "id",
                "name",
                "tipo",
                "peso",
                "colorPrimario",
                "averageCost",
              ],
            },
            {
              model: Artisan,
              attributes: ["id", "firstName", "phone", "state", "direccion"],
            },
            {
              model: Box,
              attributes: ["id", "type", "date", "ammount"],
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
    });
    res.status(200).json(lotes);
  } catch (error) {
    console.log(error.message);
    res
      .status(404)
      .json({ message: "error al obtener los lotes", detail: error.message });
  }
};

const getLotById = async (req, res) => {
  const lotId = req.params.id;

  try {
    const lote = await Lote.findByPk(lotId, {
      include: [
        {
          model: User,
        },
        {
          model: Artisan,
        },
        {
          model: Box,
        },
        {
          model: Viatico,
        },
        {
          model: Product,
          attributes: ["name", "description"],
          through: { attributes: ["quantity"] },
        },
      ],
    });

    res.status(200).json(lote);
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ message: "no hay lotes con ese ID" });
  }
};

const csvLotes = async (req, res) => {
  const { dateStart, dateEnd } = req.body;

  const where = {};

  if (dateStart && dateEnd) {
    const startDate = new Date(dateStart);
    const endDate = new Date(dateEnd);

    where.date = {
      [Op.between]: [startDate, endDate],
    };
  }

  try {
    const lotes = await Lote.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ["firstName", "userName", "phone", "email"],
        },
        {
          model: Viatico,
        },
        {
          model: MicroLot,
          attributes: ["productMicroLotAmmount", "adquisitionCost"],
          include: [
            {
              model: Product,
              attributes: [
                "id",
                "name",
                "tipo",
                "peso",
                "colorPrimario",
                "averageCost",
              ],
            },
            {
              model: Artisan,
              attributes: ["id", "firstName", "phone", "state", "direccion"],
            },
            {
              model: Box,
              attributes: ["id", "type", "date", "ammount"],
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
      raw: true,
    });

    const csvWriter = createCsvWriter({
      path: "lotes.csv",
      header: [
        { id: "id", title: "ID" },
        { id: "date", title: "Date" },
        { id: "totalAmmount", title: "Total Amount" },
        { id: "ViaticoId", title: "Viatico ID" },
        { id: "UserId", title: "User ID" },
        { id: "User.firstName", title: "User First Name" },
        { id: "User.userName", title: "User User Name" },
        { id: "User.phone", title: "User Phone" },
        { id: "User.email", title: "User Email" },
        { id: "Viatico.id", title: "Viatico ID" },
        { id: "Viatico.date", title: "Viatico Date" },
        { id: "Viatico.meal", title: "Viatico Meal" },
        { id: "Viatico.fuel", title: "Viatico Fuel" },
        { id: "Viatico.hotel", title: "Viatico Hotel" },
        { id: "Viatico.casetas", title: "Viatico Casetas" },
        { id: "Viatico.other", title: "Viatico Other" },
        { id: "Viatico.total", title: "Viatico Total" },
        {
          id: "MicroLots.productMicroLotAmmount",
          title: "MicroLots Product MicroLot Ammount",
        },
        {
          id: "MicroLots.adquisitionCost",
          title: "MicroLots Adquisition Cost",
        },
        { id: "MicroLots.Product.id", title: "MicroLots Product ID" },
        { id: "MicroLots.Product.name", title: "MicroLots Product Name" },
        { id: "MicroLots.Product.tipo", title: "MicroLots Product Tipo" },
        { id: "MicroLots.Product.peso", title: "MicroLots Product Peso" },
        {
          id: "MicroLots.Product.colorPrimario",
          title: "MicroLots Product Color Primario",
        },
        {
          id: "MicroLots.Product.averageCost",
          title: "MicroLots Product Average Cost",
        },
        { id: "MicroLots.Artisan.id", title: "MicroLots Artisan ID" },
        {
          id: "MicroLots.Artisan.firstName",
          title: "MicroLots Artisan First Name",
        },
        { id: "MicroLots.Artisan.phone", title: "MicroLots Artisan Phone" },
        { id: "MicroLots.Artisan.state", title: "MicroLots Artisan State" },
        {
          id: "MicroLots.Artisan.direccion",
          title: "MicroLots Artisan Direccion",
        },
        { id: "MicroLots.Box.id", title: "MicroLots Box ID" },
        { id: "MicroLots.Box.type", title: "MicroLots Box Type" },
        { id: "MicroLots.Box.date", title: "MicroLots Box Date" },
        { id: "MicroLots.Box.ammount", title: "MicroLots Box Ammount" },
      ],
    });

    await csvWriter.writeRecords(lotes);

    res.download("lotes.csv");
  } catch (error) {
    console.log(error.message);
    res
      .status(404)
      .json({ message: "Error al obtener los lotes", detail: error.message });
  }
};

module.exports = {
  createLote,
  getAllLotes,
  getLotById,
  csvLotes,
};
