const { DataTypes } = require("sequelize");

const userPermissionModel = (sequelize) => {
  sequelize.define("userPermission", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ver: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    crear: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    eliminar: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    modificar: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
};

module.exports = userPermissionModel;