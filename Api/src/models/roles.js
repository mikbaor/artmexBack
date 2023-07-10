const { DataTypes } = require("sequelize");

const roleModels = (sequelize) => {
  sequelize.define(
    "Role",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      roleStack: {
        type: DataTypes.STRING,
        defaultValue: "empleado",
        validate: {
          isIn: [
            [
              "administrador",
              "transportista",
              "gerente",
              "empacador",
              "etiquetador",
            ],
          ],
        },
      },
    },
    { timestamps: false }
  );
};

module.exports = roleModels;
