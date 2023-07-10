const { DataTypes } = require("sequelize");

const trailersModel = (sequelize) => {
  sequelize.define(
    "Trailer",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      placaCode: {
        type: DataTypes.STRING,
        unique:true
      },
      colour: {
        type: DataTypes.STRING,
      },
      boxNumber:{
        type: DataTypes.STRING,
      },
      company:{
        type: DataTypes.STRING,
      }
    },
    { timestamps: false }
  );
};

module.exports = trailersModel;
