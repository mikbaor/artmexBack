const { DataTypes } = require("sequelize");

const shovelingsUnloadingModel = (sequelize) => {
  sequelize.define(
    "Shovelunloading",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      date: {
        type: DataTypes.DATE,
      },  
      tarimasAmmount: {
        type: DataTypes.INTEGER,
      },
      boxesAmmount: {
        type: DataTypes.INTEGER,
      },
      // typeUnloading: {
      //   type: DataTypes.STRING,     
      // },
    },
    { timestamps: false }
  );
};

module.exports = shovelingsUnloadingModel;
