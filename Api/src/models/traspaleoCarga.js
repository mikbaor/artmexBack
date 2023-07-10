const { DataTypes } = require("sequelize");

const shovelingsChargeModel = (sequelize) => {
  sequelize.define(
    "Shovelcharge",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      date: {
        type: DataTypes.DATE,
      },
      typeTrip: {
        type: DataTypes.STRING,
        //nacional, interncional o local
      },
      exportStatus: {
        type: DataTypes.STRING,
        //completo o Pending
      },
      tarimasAmmount: {
        type: DataTypes.INTEGER,
      },
      boxesAmmount: {
        type: DataTypes.INTEGER,
      },
      observations:{
        type: DataTypes.STRING,
      },
      depositStoreId:{
        type: DataTypes.INTEGER,
      },
      totalWeight:{
        type: DataTypes.FLOAT,
      }
    },
    { timestamps: false }
  );
};

module.exports = shovelingsChargeModel;
