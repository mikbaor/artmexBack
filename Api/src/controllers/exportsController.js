const {
  Export,
  User,
  Shovelcharge,
  Box,
  Tarima,
  Boxammount,
  Product,
  conn,
} = require("../connection/db");

const axios = require("axios");

const createExport = async (req, res) => {
  let {
    userId,
    aduanalCost,
    journeyCost,
    arrivalDate,
    montacargasCost,
    otherCost,
    shovelchargeId,
  } = req.body;

  const t = await conn.transaction();

  aduanalCost = aduanalCost ? aduanalCost : 0;
  journeyCost = journeyCost ? journeyCost : 0;
  montacargasCost = montacargasCost ? montacargasCost : 0;
  otherCost = otherCost ? otherCost : 0;

  try {
    const newExport = await Export.create(
      {
        aduanalCost: aduanalCost ? aduanalCost : 0,
        arrivalDate: arrivalDate ? arrivalDate : 0 ,
        montacargasCost: montacargasCost ? montacargasCost : 0,
        otherCost: otherCost ? otherCost : 0,
        journeyCost: journeyCost ? journeyCost :0,
      },
      { transaction: t }
    );

    const carga = await Shovelcharge.findByPk(shovelchargeId, {
      transaction: t,
    });

    const user = await User.findByPk(userId, { transaction: t });
    await newExport.setUser(user, { transaction: t });
    if (carga.typeTrip == "export") {
      await carga.setExport(newExport, { transaction: t });
      await newExport.setShovelcharge(carga, { transaction: t });
      if (carga.exportStatus == "pending") {
        await carga.update({ exportStatus: "complete" }, { transaction: t });
      } else {
        throw new Error("Esta carga no esta en pendiente");
      }
    } else {
      throw new Error("Esta carga no es internacional");
    }

    let totalBoxesIds = [];

    const cajasArrei = await carga.getBoxes(
      {
        attributes: ["id"],
      },
      { transaction: t }
    );

    const newCajasArrei = cajasArrei.map((cajaid) => {
      return cajaid.dataValues.id;
    });

    const tarimasarrei = await carga.getTarimas(
      {
        attributes: ["id"],
      },
      {
        include: [
          {
            model: Box,
          },
        ],
      },
      { transaction: t }
    );

    const newtarimasarrei = tarimasarrei.map((tarimaid) => {
      return tarimaid.dataValues.id;
    });

    const boxesOfTarimas = await Tarima.findAll(
      {
        where: { id: newtarimasarrei },
        include: [
          {
            model: Box,
          },
        ],
      },
      { transaction: t }
    );

    const idBoxOfTarimas = boxesOfTarimas
      .flatMap((tarima) => tarima.Boxes)
      .map((box) => box.dataValues.id);

    if (newCajasArrei.length > 0) {
      totalBoxesIds = newCajasArrei.concat(idBoxOfTarimas);
    } else {
      totalBoxesIds = idBoxOfTarimas;
    }

    const totalBox = totalBoxesIds.length;
  

    const exportCosts = [
      parseFloat(aduanalCost),
      parseFloat(journeyCost),
      parseFloat(montacargasCost),
      parseFloat(otherCost),
    ];

    const sumaExports = exportCosts.reduce((acumulador, valorActual) => {
      return acumulador + valorActual;
    }, 0);
   

    const costPerProductExport =
      Math.round((parseFloat(sumaExports) / parseInt(totalBox)) * 10) / 10;
  

    let totalAmmount = [];
    const boxPrices = await Promise.all(
      totalBoxesIds.map(async (id) => {
        const box = await Box.findByPk(id, { transaction: t });
        const boxAmmounts = await box.getBoxammounts({ transaction: t });

        let totalAverage = 0;
        for (const boxAmmount of boxAmmounts) {
          const ammount = boxAmmount.dataValues.ammount;
          const product = await boxAmmount.getProduct({ transaction: t });
          const productAverage = product.dataValues.averageCost;
          totalAverage += productAverage;
        }


        const totalCostPerBox =
          parseFloat(totalAverage) + parseFloat(costPerProductExport);
  

        const convertMXNtoUSD = async (amount) => {
          const response = await axios.get(
            "https://api.exchangerate-api.com/v4/latest/MXN"
          );
          const exchangeRate = response.data.rates.USD;
          const convertedAmount = amount * exchangeRate;
          return convertedAmount;
        };

        const conversion = await convertMXNtoUSD(totalCostPerBox);
        const roundedNumber = conversion.toFixed(2);
  

        await box.update(
          {
            cost: totalCostPerBox,
            dollarCost: roundedNumber,
          },
          { transaction: t }
        );

        return box;
      })
    );

    await t.commit();

    const exportData = await Export.findOne({
      where: { id: newExport.id },
      include: [
        { model: User, attributes: ["id", "userName"] },
        {
          model: Shovelcharge,
        },
      ],
    });

    res.status(200).json({
      message: "Exportacion creada con éxito",
      exportDetail: exportData,
    });
  } catch (error) {
    if (t.finished !== "commit" && t.finished !== "rollback") {
      await t.rollback();
    }
    res.status(400).json({
      message: "Error al crear la exportación",
      errorDetail: error.message,
    });
  }
};

const getAllExports = async (req, res) => {
  const { dateDepart, arrivalDate, id } = req.body;

  try {
    let whereExports = {};

    if (dateDepart) whereExports.dateDepart = dateDepart;
    if (arrivalDate) whereExports.arrivalDate = arrivalDate;
    if (id) whereExports.id = id;

    const exports = await Export.findAll({
      where: whereExports,
      include: [{}],
    });

    res.status(200).json(exports);
  } catch (error) {
    res.status(400).json({
      message: "Error no se pudieron obtener las Exportaciones",
      errorDetail: error.message,
    });
  }
};

module.exports = {
  createExport,
  getAllExports,
};
