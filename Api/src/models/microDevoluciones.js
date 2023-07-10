const { DataTypes } = require("sequelize");

const microReturnsModel = (sequelize) => {
  sequelize.define(
    "Microreturn",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ammount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { timestamps: false }
  );
};

module.exports = microReturnsModel;
