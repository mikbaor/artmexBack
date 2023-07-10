const { DataTypes } = require("sequelize");

const statesModel = (sequelize) => {
  sequelize.define("State", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },{timestamps:false});
};

module.exports = statesModel;

