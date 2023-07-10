const { DataTypes } = require("sequelize");

const paymentsModels = (sequelize) => {
  sequelize.define(
    "Payment",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tipo: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
      },
      totalAmmountPay: {
        type: DataTypes.FLOAT,
      },
      debtAmmount: {
        type: DataTypes.FLOAT,
      },
    },
    { timestamps: false }
  );
};

module.exports = paymentsModels;
