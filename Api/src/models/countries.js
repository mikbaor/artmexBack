const { DataTypes } = require("sequelize");

const countriesModel = (sequelize) => {
  sequelize.define("Country", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },{timestamps:false});
};

module.exports = countriesModel;
