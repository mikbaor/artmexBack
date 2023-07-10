const { DataTypes } = require("sequelize");

const checkModels = (sequelize) => {
  sequelize.define(
    "Checker",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      date: {
        type: DataTypes.DATE,
      },
      entryTime: {
        type: DataTypes.TIME,
      },
      entryStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      exitTime: {
        type: DataTypes.TIME,
      },
      exitStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      exitMealTime: {
        type: DataTypes.TIME,
      },
      exitMealStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      arriveMealTime: {
        type: DataTypes.TIME,
      },
      arriveMealStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      longitud:{
        type: DataTypes.FLOAT,       
      },
      latitud:{
        type: DataTypes.FLOAT,        
      }
    },
    { timestamps: false }
  );
};

module.exports = checkModels;
