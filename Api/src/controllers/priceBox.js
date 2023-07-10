const { Pricebox, Box, User, conn } = require("../connection/db");

const createPrice = async (req, res) => {
  const { stateName, ratio, UserId } = req.body;

  try {
    const newPrice = await Pricebox.create({
      stateName,
      ratio,
      UserId,
    });

    res.status(202).json(newPrice);
  } catch (error) {
    res.status(400).json({ errorDetail: error.message });
  }
};

const getAllPrices = async (req, res) => {
  const { stateName } = req.body;

  const where = {};

  if (stateName) where.stateName = stateName;

  try {
    const allPrices = await Pricebox.findAll({
      where,
      attributes: ["id", "stateName", "ratio"],
      include: {
        model: User,
        attributes: ["id", "userName"],
      },
      order:[["id","DESC"]]
    });
    

    res.status(200).json(allPrices);
  } catch (error) {
    res.status(400).json({ errorDetail: error.message });
  }
};

const modifyPrice = async (req, res) => {
 
  const { UserId, ratio, priceId } = req.body;

  try {
    const priceToUpdate = await Pricebox.findOne({ where: { id: priceId } });
    if (!priceToUpdate) {
      return res.status(404).json({ errorDetail: "Price not found" });
    }

    priceToUpdate.update({
        UserId,
        ratio
    })

    res.status(200).json(priceToUpdate);
  } catch (error) {
    res.status(400).json({ errorDetail: error.message });
  }
};

module.exports = {
    createPrice,
    getAllPrices,
    modifyPrice
}