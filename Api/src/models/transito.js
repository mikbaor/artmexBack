const { DataTypes } = require("sequelize");

const transitModel = (sequelize) => {
  sequelize.define(
    "Transit",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ammountBoxes: {
        type: DataTypes.INTEGER,
      },
      ammountTarimas: {
        type: DataTypes.INTEGER,
      },
      active: {
        type: DataTypes.BOOLEAN,
      },
    },
    { timestamps: false }
  );
};

module.exports = transitModel;
