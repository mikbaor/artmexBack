const {
  User,
  Box,
  Tarima,
  Substore,
  Desentarimado,
  conn,
} = require("../connection/db");

const desentarimar = async (boxes, boxesAmmount, date, depositId, UserId) => {
  const transaction = await conn.transaction();

  try {
    const desentarimado = await Desentarimado.create({
      date,
      boxesAmmount,
    });

    for (const boxId of boxes) {
      const box = await Box.findByPk(boxId, { transaction });
      const tarima = await box.getTarima({ transaction });
      await tarima.removeBox(box, { transaction });
      const deposit = await Substore.findByPk(depositId, { transaction });

      if (deposit) {
        await box.setSubstore(deposit, { transaction });
      }
    }

    if (UserId) {
      const user = await User.findByPk(UserId, { transaction });
      await desentarimado.setUser(user, { transaction });
    }

    await transaction.commit();

    return desentarimado;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const tarimasAcajas = async (tarimas) => {
  let cajasIds = [];

  for (const tar of tarimas) {
    const tarima = await Tarima.findByPk(tar.id);
    const cajasDeTarima = await tarima.getBoxes({
      attributes: ["id"],
    });
    cajasIds = cajasIds.concat(cajasDeTarima.map((caja) => caja.id));
  }

  return cajasIds;
};

const getTarimasbycharge = async (carga) => {
  const transaction = await conn.transaction();
  await carga.getTarimas(
    {
      attributes: ["id"],
    },
    { transaction: t }
  );


};

module.exports = {
  desentarimar,
  tarimasAcajas,
  getTarimasbycharge
};

//costo de las cajas cuando se hace la exportacion
//columna cajas

//tabla de conversion por estado
//escoger si es por el estado o manual

//seteo precios por estado
