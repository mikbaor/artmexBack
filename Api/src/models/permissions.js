const { DataTypes } = require("sequelize");

const permissionsModels = (sequelize) => {
  sequelize.define(
    "Permission",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      seeUsers: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createUsers: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      editUsers: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      deleteUsers: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      seeArtisans: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createArtisans: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      editArtisans: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      deleteArtisans: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      seeProducts: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createProducts: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      editProducts: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      seeLotes: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createLotes: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      seeBoxes: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createBoxes: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      seeTarimas: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createTarimas: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      uncreateTarimas: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      seeScrapt: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createScrapt: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      seeReturns: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createReturns: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      seeStore: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createStore: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      addSubStore: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      deleteStore: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      seeCharges: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createCharges: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      seeTransits: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createExport: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      seeUnCharges: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createUnCharges: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      seeSales: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createSales: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      seePays: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createPays: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      seePrices: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createPrices: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      seeClients: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createClients: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      editClients: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      seeDashboard: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createReprint: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      seePedidos: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createPedidos: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    { timestamps: false }
  );
};


module.exports = permissionsModels;