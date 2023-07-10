const { DataTypes } = require("sequelize");

const userModels = (sequelize) => {
  sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userName:{
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
      },
      civilSituation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
      },
      state: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      satId:{
        type: DataTypes.STRING        
      },
      schedule:{
        type:DataTypes.STRING
      },
      emergencyPhone:{
        type: DataTypes.STRING,
      },
      sons:{
        type: DataTypes.STRING,
      },
      inDate:{
        type: DataTypes.DATE 
      },
      outDate:{
        type: DataTypes.DATE,
        
      }
    },
    { timestamps: false }
  );
};

module.exports = userModels;
