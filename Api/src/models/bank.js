const { DataTypes } = require("sequelize");

const bankModel = (sequelize) => {
  sequelize.define(
    "Bank",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name:{
        type: DataTypes.STRING,
        unique:true
      },
      netIncome: {
        type: DataTypes.FLOAT,
        defaultValue:0
      },
      grossIncome: {
        type: DataTypes.FLOAT,
        defaultValue:0
      },
      pendingIncome: {
        type: DataTypes.FLOAT,
        defaultValue:0
      },
      expenses:{
        type: DataTypes.FLOAT,
        defaultValue:0
      },
      actives:{
        type: DataTypes.FLOAT,
        defaultValue:0
      }
    },
    { timestamps: false }
  );
};

module.exports = bankModel;
