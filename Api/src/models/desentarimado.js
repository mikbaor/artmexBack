const { DataTypes } = require("sequelize");

const desentarimadoModel = (sequelize) => {
  sequelize.define(
    "Desentarimado",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      date: {
        type: DataTypes.DATE,
      },      
      boxesAmmount: {
        type: DataTypes.INTEGER,
      },      
    },
    { timestamps: false }
  );
};

module.exports = desentarimadoModel;