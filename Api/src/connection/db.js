require("dotenv").config();
const { Sequelize } = require("sequelize");

//modelos
const permissionsModels = require("../models/permissions");
const roleModels = require("../models/roles");
const userModels = require("../models/users");
const addressModel = require("../models/addres");
const countriesModel = require("../models/countries");
const statesModel = require("../models/states");
const artisansModel = require("../models/artesanos");
const boxesModel = require("../models/caja");
const productsModel = require("../models/productos");
const returnsModel = require("../models/devoluciones");
const scrapsModel = require("../models/scrap");
const viaticosModel = require("../models/viaticos");
const storesModel = require("../models/almacenes");
const chofersModel = require("../models/chofer");
const exportsModel = require("../models/exportaciones");
const tarimasModel = require("../models/tarimas");
const lotesModel = require("../models/lote");
const microLotModels = require("../models/microLot");
const clientsModel = require("../models/clients");
const microScrapModels = require("../models/microScrap");
const subStoresModel = require("../models/subAlmacen");
const priceProductsModel = require("../models/pricesProducts");
const AmmountBoxesModel = require("../models/cajaAmmount");
const microReturnsModel = require("../models/microDevoluciones");
const shovelingsChargeModel = require("../models/traspaleoCarga");
const transitModel = require("../models/transito");
const shovelingsUnloadingModel = require("../models/traspaleoDescarga");
const trailersModel = require("../models/trailer");
const weighterModels = require("../models/pesadora");
const microOrdersModels = require("../models/microPedido");
const ordersModels = require("../models/pedidos");
const saleModels = require("../models/sale");
const microSalesModels = require("../models/microVentas");
const paymentsModels = require("../models/pagos");
const microPaymentsModels = require("../models/microPagos");
const desentarimadoModel = require("../models/desentarimado");
const priceBoxesModel = require("../models/priceboxes");
const fotoSalesModel = require("../models/fotosSales");
const fotoChofersModel = require("../models/fotosChofer");
const printerModel = require("../models/printer");
const checkModels = require("../models/checador");
const checkPassModel = require("../models/checkinpass");
const paymentMethodModel = require("../models/paymentMethods");
//const bankModel = require("../models/bank");

//definificion de los datos de la conexion
const { DB_USER, DB_NAME, DB_PASSWORD, DB_PORT, DB_HOST } = process.env;

// creacion de la conexcion implementado los datos de la conexion
const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  {
    logging: false,
    native: false,
  }
);

//definificion de los modelos
roleModels(sequelize);
permissionsModels(sequelize);
userModels(sequelize);
addressModel(sequelize);
countriesModel(sequelize);
statesModel(sequelize);
artisansModel(sequelize);
boxesModel(sequelize);
productsModel(sequelize);
returnsModel(sequelize);
scrapsModel(sequelize);
viaticosModel(sequelize);
storesModel(sequelize);
chofersModel(sequelize);
exportsModel(sequelize);
tarimasModel(sequelize);
lotesModel(sequelize);
microLotModels(sequelize);
clientsModel(sequelize);
microScrapModels(sequelize);
subStoresModel(sequelize);
priceProductsModel(sequelize);
AmmountBoxesModel(sequelize);
microReturnsModel(sequelize);
shovelingsChargeModel(sequelize);
shovelingsUnloadingModel(sequelize);
transitModel(sequelize);
trailersModel(sequelize);
weighterModels(sequelize);
microOrdersModels(sequelize);
ordersModels(sequelize);
saleModels(sequelize);
microSalesModels(sequelize);
paymentsModels(sequelize);
microPaymentsModels(sequelize);
desentarimadoModel(sequelize);
priceBoxesModel(sequelize);
fotoSalesModel(sequelize);
fotoChofersModel(sequelize);
printerModel(sequelize);
checkModels(sequelize);
checkPassModel(sequelize);
paymentMethodModel(sequelize);
//bankModel(sequelize)

//desestructurados los modelos que hemos guardado en sequelize
const {
  User,
  Role,
  Permission,
  Address,
  Country,
  State,
  Artisan,
  Box,
  Product,
  Return,
  Scrap,
  Viatico,
  Store,
  Chofer,
  Export,
  Tarima,
  Lote,
  MicroLot,
  Client,
  MicroScrap,
  Substore,
  Priceproduct,
  Boxammount,
  Microreturn,
  Transit,
  Shovelunloading,
  Shovelcharge,
  Trailer,
  Weighter,
  Order,
  Microorder,
  Sale,
  Microsale,
  Payment,
  Micropayment,
  Desentarimado,
  Pricebox,
  Salephotos,
  Chofersphotos,
  Printer,
  Checker,
  Checkpass,
  Paymentmethod,
} = sequelize.models;

//RELACIONES DE LOS MODELOS

//paises y estados en el array de regristros
State.belongsTo(Country, {
  foreignKey: "CountryId",
  targetKey: "id",
  as: "States",
});
Country.hasMany(State, { foreignKey: "CountryId", as: "States" });

//relacion de artesanos
Artisan.belongsToMany(Product, { through: "ArtisanProduct" });
Product.belongsToMany(Artisan, { through: "ArtisanProduct" });

Artisan.belongsTo(User);
User.belongsTo(Artisan);

//relacion usuarios
User.belongsTo(Role);
User.hasMany(Permission);
User.belongsTo(Address);
User.hasMany(Product);
Product.belongsTo(User);
User.hasMany(Checker);
Checker.belongsTo(User);

//relacion de Almacenes
User.hasMany(Store);
Store.belongsTo(User);
Store.hasMany(Substore);
Substore.belongsTo(Store);

//relacion de Subalmacenes
Substore.hasMany(Box);
Box.belongsTo(Substore);
Substore.hasMany(Tarima);
Tarima.belongsTo(Substore);
Substore.belongsToMany(Product, { through: "SubstoreProduct" });
Product.belongsToMany(Substore, { through: "SubstoreProduct" });
Substore.belongsTo(User);
User.hasMany(Substore);

//relacion cajas y tarimas
Tarima.hasMany(Box);
Box.belongsTo(Tarima);
User.hasMany(Box);
Box.belongsTo(User);
User.hasMany(Tarima);
Tarima.belongsTo(User);

//relaciones del lote
Lote.hasMany(MicroLot);
MicroLot.belongsTo(Lote);
MicroLot.belongsTo(Product);
MicroLot.belongsTo(Artisan);
MicroLot.belongsTo(Box);
Product.belongsTo(MicroLot);
Box.belongsTo(MicroLot);
Lote.belongsTo(Viatico);
User.hasMany(Lote);
Lote.belongsTo(User);

//relacion de rembolso cambios
Return.hasMany(Microreturn);
Microreturn.belongsTo(Return);
User.hasMany(Return);
Return.belongsTo(User);
Microreturn.belongsTo(Product);
Microreturn.belongsTo(Artisan);

//relacion scrap
Scrap.hasMany(MicroScrap);
MicroScrap.belongsTo(Scrap);
MicroScrap.belongsToMany(Product, { through: "MicroScrapProduct" });
Product.belongsToMany(MicroScrap, { through: "MicroScrapProduct" });
User.hasMany(Scrap);
Scrap.belongsTo(User);

//relaciones exportacion
Export.hasMany(Tarima);
Tarima.belongsTo(Export);
Export.hasMany(Box);
Box.belongsTo(Export);
User.hasMany(Export);
Export.belongsTo(User);

//relaciones clientes
Client.hasMany(Product);
Client.hasMany(Box);
Client.hasMany(Tarima);
User.hasMany(Client);
Client.belongsTo(User);

//relaciones de producto precio
Product.hasMany(Priceproduct);

//relaciones de producto caja
Box.hasMany(Boxammount);
Boxammount.belongsTo(Product);

//Relaciones con el traspaleo de carga
Shovelcharge.hasMany(Shovelunloading); // la carga tiene varias descargas
Shovelcharge.belongsToMany(Tarima, { through: "TarimaShovelcharge" }); // la carga tiene varias tarimas
Tarima.belongsToMany(Shovelcharge, { through: "TarimaShovelcharge" });
Shovelcharge.belongsToMany(Box, { through: "BoxShovelcharge" }); // la carga tiene varias cajas
Box.belongsToMany(Shovelcharge, { through: "BoxShovelcharge" });
User.hasMany(Shovelcharge); // quien registra el traspaleo
Shovelcharge.belongsTo(User);
Chofer.hasMany(Shovelcharge); //que chofer se lleva la carga
Shovelcharge.belongsTo(Chofer);
Shovelcharge.belongsTo(Store); //la carga se saca de 1 almacen
Shovelcharge.belongsTo(Export); // la carga puede tener 1 exportacion
Export.belongsTo(Shovelcharge);
Shovelcharge.belongsTo(Trailer); // que trailer se asocia a la carga

//Relaciones con el traspaleo de descarga
Shovelunloading.belongsTo(Shovelcharge);
Shovelunloading.belongsToMany(Tarima, { through: "TarimaShovelunloading" });
Tarima.belongsToMany(Shovelunloading, { through: "TarimaShovelunloading" });
Shovelunloading.belongsToMany(Box, { through: "BoxShovelunloading" });
Box.belongsToMany(Shovelunloading, { through: "BoxShovelunloading" });
Shovelunloading.belongsTo(Store); //la la descarga se baja a 1 almacen
Shovelunloading.belongsTo(User);
Chofer.hasMany(Shovelunloading); //que chofer se lleva la carga
Shovelunloading.belongsTo(Chofer);
Shovelunloading.belongsTo(Export); // la carga puede tener 1 exportacion
Export.belongsTo(Shovelunloading);
Shovelunloading.belongsTo(Trailer); // que trailer se asocia a la carga
Shovelunloading.belongsTo(Substore);

//Relaciones con el transito
Shovelcharge.belongsTo(Transit);
Transit.belongsTo(Shovelcharge);
Shovelunloading.belongsTo(Transit);
Transit.belongsTo(Shovelunloading);
Tarima.belongsTo(Transit);
Transit.hasMany(Tarima);
Box.belongsTo(Transit);
Transit.hasMany(Box);

//relaciones de pedidos
Order.hasMany(Microorder);
Microorder.belongsTo(Order);
Microorder.belongsTo(Product);
Product.hasMany(Microorder);
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(Client);
Client.hasMany(Order);
Order.belongsTo(Sale);

//relaciones de ventas
Sale.hasMany(Microsale);
Microsale.belongsTo(Sale);
Microsale.belongsTo(Box);
Box.belongsTo(Microsale);
Sale.belongsTo(Payment);
Payment.belongsTo(Sale);
Payment.hasMany(Micropayment);
Micropayment.belongsTo(Payment);
Sale.belongsTo(User);
User.hasMany(Sale);
Sale.belongsTo(Client);
Client.hasMany(Sale);
Sale.belongsTo(Order);
Sale.hasMany(Salephotos);
Salephotos.belongsTo(Sale);
Sale.hasMany(Paymentmethod);
Paymentmethod.belongsTo(Sale);
Sale.hasMany(Tarima);
Tarima.belongsTo(Sale);

//relaciones de Desentarimado
Desentarimado.hasMany(Box);
Desentarimado.belongsTo(User);
User.hasMany(Desentarimado);

//Relaciones de Precios
Pricebox.belongsTo(Box);
Pricebox.belongsTo(User);
Box.belongsTo(Pricebox);

//relacionando fotos de Chofer
Chofersphotos.belongsTo(Chofer);
Chofer.belongsTo(Chofersphotos);

//relaciones entre printer, cajas, tarimas, almacenes
Printer.belongsTo(Box);
Box.belongsTo(Printer);
Printer.belongsTo(Tarima);
Tarima.belongsTo(Printer);

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};
