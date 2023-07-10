const {
  Shovelcharge,
  Shovelunloading,
  Chofersphotos,
  Tarima,
  Box,
  User,
  Chofer,
  Trailer,
  Store,
  Substore,
  Export,
  Transit,
  conn,
} = require("../connection/db");
const PDFDocument = require("pdfkit");
// const PdfkitConstruct = require("pdfkit-construct");
const { createTable } = require("pdfkit-table");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

const { Op } = require("sequelize");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const createCarga = async (req, res) => {
  const {
    boxes,
    tarimas,
    userId,
    choferId,
    trailerId,
    almacenId,
    depositId,
    totalWeight,
    date,
    typeTrip,
    tarimasAmmount,
    boxesAmmount,
    observations,
    depositStoreId,
  } = req.body;

  const t = await conn.transaction();

  try {
    const defaultExportStatus = typeTrip === "export" ? "pending" : "none";

    const newshovelcharge = await Shovelcharge.create(
      {
        date,
        typeTrip,
        exportStatus: defaultExportStatus,
        tarimasAmmount,
        boxesAmmount,
        observations,
        depositStoreId,
        totalWeight,
      },
      { transaction: t }
    );

    let transit;
    if (typeTrip !== "interno") {
      transit = await Transit.create(
        {
          ammountBoxes: boxesAmmount,
          ammountTarimas: tarimasAmmount,
          active: true,
        },
        { transaction: t }
      );
    }

    const user = await User.findByPk(userId, { transaction: t });
    const chofer = await Chofer.findByPk(choferId, { transaction: t });
    const trailer = await Trailer.findByPk(trailerId, { transaction: t });
    const almacen = await Store.findByPk(almacenId, { transaction: t });

    if (boxes) {
      const dboxes = await Promise.all(
        boxes.map(async (box) => {
          const boxData = await Box.findByPk(box.id, { transaction: t });
          const substore = await boxData.getSubstore({ transaction: t });
          if (!substore) {
            throw new Error("Esta caja no está vinculada a ningún subalmacén");
          }

          if (typeTrip !== "interno") {
            await substore.removeBox(boxData, { transaction: t });
            await transit.setBoxes(boxData, { transaction: t });
          } else {
            await boxData.set({ SubstoreId: depositId }, { transaction: t });
            await boxData.save();
          }
          await newshovelcharge.addBox(boxData, { transaction: t });

          return boxData;
        })
      );
    }

    if (tarimas) {
      const dtarimas = await Promise.all(
        tarimas.map(async (tarima) => {
          const tarimaData = await Tarima.findByPk(tarima.id, {
            transaction: t,
          });
          const substore = await tarimaData.getSubstore({ transaction: t });
          if (!substore) {
            throw new Error(
              "Esta tarima no está vinculada a ningún subalmacén"
            );
          }

          if (typeTrip !== "interno") {
            await substore.removeTarima(tarimaData, { transaction: t });
            await transit.setTarimas(tarimaData, { transaction: t });
          } else {
            await tarimaData.set({ SubstoreId: depositId }, { transaction: t });
            await tarimaData.save();
          }
          await newshovelcharge.addTarima(tarimaData, { transaction: t });

          return tarimaData;
        })
      );
    }

    await newshovelcharge.setUser(user, { transaction: t });
    await newshovelcharge.setChofer(chofer, { transaction: t });
    await newshovelcharge.setTrailer(trailer, { transaction: t });
    await newshovelcharge.setStore(almacen, { transaction: t });
    if (typeTrip !== "interno") {
      await newshovelcharge.setTransit(transit, { transaction: t });
      await transit.setShovelcharge(newshovelcharge, { transaction: t });
    }

    await t.commit();

    const carga = await Shovelcharge.findByPk(newshovelcharge.id, {
      include: [
        { model: User },
        { model: Chofer },
        { model: Trailer },
        { model: Store },
        { model: Box },
        { model: Tarima },
      ],
    });

    if (typeTrip !== "interno") {
      const transito = await Transit.findByPk(transit.id, {
        include: [{ model: Box }, { model: Tarima }],
      });
    }

    res.status(200).json({
      message: "Carga creada exitosamente",
      cargaDetail: carga,
    });
  } catch (error) {
    if (t.finished !== "commit" && t.finished !== "rollback") {
      await t.rollback();
    }
    res
      .status(400)
      .json({ message: "Error al crear la carga", errorDetail: error.message });
  }
};

const getAllCargas = async (req, res) => {
  const {
    nameUser,
    choferName,
    placaCode,
    dateExit,
    typeTrip,
    exportStatus,
    storeName,
  } = req.body;

  const where = {};
  const whereUser = {};
  const whereChofer = {};
  const whereTrailer = {};
  const whereStore = {};

  if (nameUser) whereUser.firstName = { [Op.like]: `%${nameUser}%` };
  if (choferName) whereChofer.firstName = { [Op.like]: `%${choferName}%` };
  if (placaCode) whereTrailer.placaCode = placaCode;
  if (dateExit) where.date = dateExit;
  if (typeTrip) where.typeTrip = typeTrip;
  if (exportStatus) where.exportStatus = exportStatus;
  if (storeName) whereStore.name = { [Op.like]: `%${storeName}%` };

  try {
    const cargas = await Shovelcharge.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ["firstName", "userName", "phone", "email"],
          where: whereUser,
        },
        {
          model: Chofer,
          attributes: ["firstName", "lastName", "license"],
          where: whereChofer,
        },
        {
          model: Trailer,
          where: whereTrailer,
        },
        {
          model: Store,
          where: whereStore,
        },
        {
          model: Box,
        },
        {
          model: Tarima,
        },
      ],
      order: [["id", "DESC"]],
    });
    res.status(200).json(cargas);
  } catch (error) {
    res.status(400).json({
      message: "Error al obtener las cargas",
      errorDetail: error.message,
    });
  }
};

const createUnloading = async (req, res) => {
  const {
    boxes,
    tarimas,
    userId,
    choferId,
    trailerId,
    storeId,
    depositId,
    date,
    cargasId,
    tarimasAmmount,
    boxesAmmount,
  } = req.body;

  const t = await conn.transaction();

  try {
    const newShovelunloading = await Shovelunloading.create(
      {
        date,
        tarimasAmmount,
        boxesAmmount,
      },
      { transaction: t }
    );

    const store = await Store.findByPk(storeId, { transaction: t });
    const carga = await Shovelcharge.findByPk(cargasId, { transaction: t });
    let transit = await carga.getTransit({ transaction: t });

    const substore = await Substore.findByPk(depositId, { transaction: t });
    if (!substore) {
      throw new Error("El subalmacén especificado no existe");
    }

    if (boxes) {
      const dboxes = await Promise.all(
        boxes.map(async (box) => {
          const boxData = await Box.findByPk(box.id, { transaction: t });
          transit = await carga.getTransit({ transaction: t });
          if (!transit) {
            throw new Error("No hay transito relacionado");
          }
          await transit.removeBoxes(boxData, { transaction: t });
          await substore.addBox(boxData, { transaction: t });
          await newShovelunloading.addBox(boxData, { transaction: t });
          return boxData;
        })
      );
    }

    if (tarimas) {
      const dtarimas = await Promise.all(
        tarimas.map(async (tarima) => {
          const tarimaData = await Tarima.findByPk(tarima.id, {
            transaction: t,
          });
          transit = await carga.getTransit({ transaction: t });
          if (!transit) {
            throw new Error("No hay transito relacionado");
          }
          await transit.removeTarima(tarimaData, { transaction: t });
          await substore.addTarima(tarimaData, { transaction: t });
          await newShovelunloading.addTarima(tarimaData, { transaction: t });
          return tarimaData;
        })
      );
    }

    const user = await User.findByPk(userId, { transaction: t });
    const chofer = await Chofer.findByPk(choferId, { transaction: t });
    const trailer = await Trailer.findByPk(trailerId, { transaction: t });

    await transit.update({ active: false }, { transaction: t });
    await newShovelunloading.setUser(user, { transaction: t });
    await newShovelunloading.setChofer(chofer, { transaction: t });
    await newShovelunloading.setTrailer(trailer, { transaction: t });
    await newShovelunloading.setSubstore(substore, { transaction: t });
    await newShovelunloading.setStore(store, { transaction: t });
    await newShovelunloading.setTransit(transit, { transaction: t });
    await newShovelunloading.setShovelcharge(carga, { transaction: t });
    await transit.setShovelunloading(newShovelunloading, { transaction: t });

    await t.commit();

    const unloading = await Shovelunloading.findByPk(newShovelunloading.id, {
      include: [
        { model: User },
        { model: Chofer },
        { model: Trailer },
        { model: Substore },
        { model: Box },
        { model: Tarima },
      ],
    });

    res.status(200).json({
      message: "Descarga creada exitosamente",
      unloadingDetail: unloading,
    });
  } catch (error) {
    console.error(error);
    if (t.finished !== "commit" && t.finished !== "rollback") {
      await t.rollback();
    }
    res.status(400).json({
      message: "Error al crear la descarga",
      errorDetail: error.message,
    });
  }
};

// agregar relacion descaarga y store o almacen

const getAllDescargas = async (req, res) => {
  const { nameUser, choferName, trailerPlacaCode, date, storeName } = req.body;

  const where = {};
  const whereUser = {};
  const whereChofer = {};
  const whereTrailer = {};
  const whereStore = {};

  if (nameUser) where.firstName = { [Op.like]: `%${nameUser}%` };
  if (choferName) whereChofer.firstName = { [Op.like]: `%${choferName}%` };
  if (trailerPlacaCode)
    whereTrailer.placaCode = { [Op.like]: `%${trailerPlacaCode}%` };
  if (date) where.date = date;
  if (storeName) whereStore.name = { [Op.like]: `%${storeName}%` };

  try {
    const descargas = await Shovelunloading.findAll({
      where,
      include: [
        {
          model: User,
          where: whereUser,
        },
        {
          model: Chofer,
          include: [
            {
              model: Chofersphotos,
            },
          ],
          where: whereChofer,
        },
        {
          model: Trailer,
          where: whereTrailer,
        },
        {
          model: Substore,
          where: whereStore,
        },
        {
          model: Box,
        },
        {
          model: Tarima,
        },
        {
          model: Transit,
        },
        {
          model: Shovelcharge,
          include: [
            {
              model: Export,
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
    });
    res.status(200).json(descargas);
  } catch (error) {
    res.status(400).json({
      message: "Error al obtener las descargas",
      errorDetail: error.message,
    });
  }
};

const getAllExports = async (req, res) => {
  const { date, tipo } = req.body;

  const where = {};

  if (date) where.date = date;
  if (tipo) where.typeTrip = tipo;

  try {
    const cargas = await Shovelcharge.findAll({
      where,
      include: [
        { model: User },
        { model: Store },
        {
          model: Box,
          attributes: {
            exclude: ["etiqueta"], // Excluir la columna 'etiqueta'
          },
        },
        {
          model: Tarima,
          attributes: {
            exclude: ["etiqueta"], // Excluir la columna 'etiqueta'
          },
        },
      ],
      order: [["id", "DESC"]],
    });

    res.status(200).json(cargas);
  } catch (error) {
    res.status(400).json({
      message: "Error al obtener las cargas",
      errorDetail: error.message,
    });
  }
};

const csvCharges = async (req, res) => {
  const { dateStart, dateEnd } = req.body;

  const where = {};

  if (dateStart && dateEnd) {
    const startDate = new Date(dateStart);
    const endDate = new Date(dateEnd);

    where.date = {
      [Op.between]: [startDate, endDate],
    };
  }

  try {
    const cargas = await Shovelcharge.findAll({
      where,
      include: [
        { model: User },
        { model: Chofer },
        { model: Trailer },
        { model: Store },
        {
          model: Box,
        },
        {
          model: Tarima,
        },
      ],
      order: [["id", "DESC"]],
      raw: true,
    });

    const csvWriter = createCsvWriter({
      path: "loading.csv",
      header: [
        { id: "id", title: "ID" },
        { id: "date", title: "Date" },
        { id: "typeTrip", title: "Type Trip" },
        { id: "exportStatus", title: "Export Status" },
        { id: "tarimasAmmount", title: "Tarimas Amount" },
        { id: "boxesAmmount", title: "Boxes Amount" },
        { id: "totalWeight", title: "Total Weight" },
        { id: "User.firstName", title: "User First Name" },
        { id: "User.lastName", title: "User Last Name" },
        { id: "User.userName", title: "User Username" },
        { id: "User.schedule", title: "User Schedule" },
        { id: "User.RoleId", title: "User Role ID" },
        { id: "Chofer.firstName", title: "Chofer First Name" },
        { id: "Chofer.lastName", title: "Chofer Last Name" },
        { id: "Chofer.license", title: "Chofer License" },
        { id: "Trailer.placaCode", title: "Trailer Placa Code" },
        { id: "Trailer.colour", title: "Trailer Colour" },
        { id: "Store.name", title: "Store Name" },
        { id: "Store.country", title: "Store Country" },
        { id: "Store.state", title: "Store State" },
        { id: "Store.city", title: "Store City" },
        { id: "Store.address", title: "Store Address" },
        { id: "Boxes.id", title: "Boxes ID" },
        { id: "Boxes.date", title: "Boxes Date" },
        { id: "Boxes.reimpressionAmmount", title: "Boxes Reimpression Amount" },
        { id: "Boxes.itsSell", title: "Boxes isSell" },
        { id: "Boxes.cost", title: "Boxes Mexican Cost" },
        { id: "Boxes.dollarCost", title: "Boxes Dollar Cost" },
        {
          id: "Boxes.BoxShovelcharge.createdAt",
          title: "Boxes Shovelcharge Created At",
        },
        {
          id: "Boxes.BoxShovelcharge.updatedAt",
          title: "Boxes Shovelcharge Updated At",
        },
        { id: "Tarimas.id", title: "Tarimas ID" },
        { id: "Tarimas.date", title: "Tarimas Date" },
        {
          id: "Tarimas.reimpressionAmmount",
          title: "Tarimas Reimpression Amount",
        },
        {
          id: "Tarimas.TarimaShovelcharge.createdAt",
          title: "Tarimas Shovelcharge Created At",
        },
      ],
    });

    await csvWriter.writeRecords(cargas);

    res.download("loading.csv");
  } catch (error) {
    res.status(400).json({
      message: "Error al obtener las cargas",
      errorDetail: error.message,
    });
  }
};

const csvDescargas = async (req, res) => {
  const { dateStart, dateEnd } = req.body;

  const where = {};

  if (dateStart && dateEnd) {
    const startDate = new Date(dateStart);
    const endDate = new Date(dateEnd);

    where.date = {
      [Op.between]: [startDate, endDate],
    };
  }

  try {
    const descargas = await Shovelunloading.findAll({
      where,
      include: [
        { model: User },
        { model: Chofer },
        { model: Trailer },
        { model: Store },
        { model: Box },
        { model: Tarima },
      ],
      order: [["id", "DESC"]],
      raw: true,
    });

    const csvWriter = createCsvWriter({
      path: "descargas.csv",
      header: [
        { id: "id", title: "ID" },
        { id: "date", title: "Date" },
        { id: "tarimasAmmount", title: "Tarimas Amount" },
        { id: "boxesAmmount", title: "Boxes Amount" },
        { id: "StoreId", title: "Store ID" },
        { id: "UserId", title: "User ID" },
        { id: "ChoferId", title: "Chofer ID" },
        { id: "TrailerId", title: "Trailer ID" },
        { id: "SubstoreId", title: "Substore ID" },
        { id: "TransitId", title: "Transit ID" },
        { id: "User.firstName", title: "User First Name" },
        { id: "User.userName", title: "User Username" },
        { id: "Chofer.firstName", title: "Chofer First Name" },
        { id: "Chofer.lastName", title: "Chofer Last Name" },
        { id: "Chofer.license", title: "Chofer License" },
        { id: "Trailer.placaCode", title: "Trailer Placa Code" },
        { id: "Trailer.colour", title: "Trailer Colour" },
        { id: "Substore.name", title: "Substore Name" },
        { id: "Boxes.id", title: "Boxes ID" },
        { id: "Boxes.reimpressionAmmount", title: "Boxes Reimpression Amount" },
        { id: "Boxes.itsSell", title: "Boxes isSell" },
        { id: "Boxes.cost", title: "Boxes Cost" },
        { id: "Boxes.dollarCost", title: "Boxes Dollar Cost" },
        { id: "Tarimas.id", title: "Tarimas ID" },
        { id: "Tarimas.date", title: "Tarimas Date" },
        {
          id: "Tarimas.reimpressionAmmount",
          title: "Tarimas Reimpression Amount",
        },
      ],
    });

    await csvWriter.writeRecords(descargas);

    res.download("descargas.csv");
  } catch (error) {
    res.status(400).json({
      message: "Error al obtener las descargas",
      errorDetail: error.message,
    });
  }
};

const documentPdf = async (req, res) => {
  const { id } = req.body;

  const concatId = id.toString();

  const qrData = `EMB${concatId}`;

  const qrImagePath = path.join(__dirname, `../../uploads/imagesQr/qr_.png`);

  try {
    await QRCode.toFile(qrImagePath, qrData);

    const carga = await Shovelcharge.findByPk(id, {
      include: [
        { model: User },
        { model: Chofer },
        { model: Trailer },
        { model: Store },
        { model: Box },
        { model: Tarima },
      ],
    });

    const destinyId = carga.dataValues.depositStoreId;

    const destiny = await Store.findByPk(destinyId);

    const totalCajas = carga.dataValues.boxesAmmount
      ? carga.dataValues.boxesAmmount
      : 0;
    const weigthCarga = carga.dataValues.totalWeight
      ? carga.dataValues.totalWeight
      : 0;

    const doc = new PDFDocument();

    const imagePath = path.join(__dirname, "../../uploads/logo.png");
    const imagePath2 = path.join(
      __dirname,
      `../../uploads/imagesQr/qr_${id}.png`
    );
   
        doc.image(imagePath, 95, 25, { width: 85, height: 85 });

        doc.image(imagePath2, 330, 100, { width: 175, height: 175 });

        doc.font("Helvetica-Bold").fontSize(24);
        // Agregar título
        doc.text(`Detalles de EMB${id}`, { align: "center" });

        // Agregar datos de prueba
        doc
          .moveDown()
          .font("Helvetica-Bold")
          .fontSize(16)
          .text("DATOS DEL ORIGEN:", { align: "left" });
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .text("Empresa:", { continued: true })
          .font("Helvetica")
          .text("Artmex imports corp");
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .text(`Chofer:`, { continued: true })
          .font("Helvetica")
          .text(
            `${carga.dataValues.Chofer.dataValues.firstName} ${carga.dataValues.Chofer.dataValues.lastName}`
          );
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .text(`Placa del Trailer:`, { continued: true })
          .font("Helvetica")
          .text(`${carga.dataValues.Trailer.dataValues.placaCode}`);
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .text("Bodega de Salida:", { continued: true })
          .font("Helvetica")
          .text(carga.dataValues.Store.dataValues.name);
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .text("Pais:", { continued: true })
          .font("Helvetica")
          .text(carga.dataValues.Store.dataValues.country);
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .text("Estado:", { continued: true })
          .font("Helvetica")
          .text(carga.dataValues.Store.dataValues.state);
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .text("Ciudad:", { continued: true })
          .font("Helvetica")
          .text(carga.dataValues.Store.dataValues.city);
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .text("Direccion:", { continued: true })
          .font("Helvetica")
          .text(carga.dataValues.Store.dataValues.address);

        // DESTINO
        doc
          .moveDown()
          .font("Helvetica-Bold")
          .fontSize(16)
          .text("DATOS DEL DESTINO:", { align: "left" });
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .text(`Bodega destino:`, { continued: true })
          .font("Helvetica")
          .text(destiny.dataValues.name);
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .text(`Pais:`, { continued: true })
          .font("Helvetica")
          .text(destiny.dataValues.country);
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .text("Estado:", { continued: true })
          .font("Helvetica")
          .text(destiny.dataValues.state);
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .text("Direccion:", { continued: true })
          .font("Helvetica")
          .text(destiny.dataValues.address);

        // CARGA
        doc
          .moveDown()
          .font("Helvetica-Bold")
          .fontSize(16)
          .text("DATOS DEL LA CARGA:", { align: "left" });
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .text("Cantidad de Tarimas:", { continued: true })
          .font("Helvetica")
          .text(carga.dataValues.tarimasAmmount);
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .text("Cajas sueltas:", { continued: true })
          .font("Helvetica")
          .text(totalCajas);
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .text("Peso de la Carga:", { continued: true })
          .font("Helvetica")
          .text(weigthCarga);
    
    let fontBold = "Helvetica-Bold";

    let orderInfo = {
      orderNo: "15484659",
      invoiceNo: "MH-MU-1077",
      invoiceDate: "11/05/2021",
      invoiceTime: "10:57:00 PM",
      products: [
        {
          id: "15785",
          name: "Cerdito piedra",
          company: "Acer",
          qty: 39999,
          totalPrice: 39999,
          tipo: "Pequeño",
        },
        {
          id: "15786",
          name: "Molcajete",
          company: "Dell",
          qty: 2999,
          totalPrice: 5998,
          tipo: "Grande",
        },
      ],
      totalValue: 45997,
    };

doc.rect(70, 450, 480, 20).fill("#FC427B").stroke("#FC427B");
doc.fillColor("#fff").text("ID", 75, 456, { width: 90 });
doc.text("Producto", 130, 456, { width: 190 });
doc.text("Descripcion", 270, 456, { width: 100 });
doc.text("Qty", 380, 456, { width: 100 });
doc.text("Total Price", 480, 456, { width: 100 });

let productNo = 1;
orderInfo.products.forEach(element => {
let y = 456 + (productNo * 20);
doc.fillColor("#000").text(element.id, 75, y, { width: 90 });
doc.text(element.name, 130, y, { width: 190 });
doc.text(element.tipo, 270, y, { width: 100 });
doc.text(element.qty, 380, y, { width: 100 });
doc.text(element.totalPrice, 480, y, { width: 100 });
productNo++;
});

doc.rect(70, 456 + (productNo * 20), 480, 0.2).fillColor("#000").stroke("#000");
productNo++;

doc.font(fontBold).text("Total:", 380, 456 + (productNo * 17));
doc.font(fontBold).text(orderInfo.totalValue, 480, 456 + (productNo * 17));

   
    // Generar el archivo PDF en memoria
    const buffers = [];
    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => {
      // Combinar los fragmentos del buffer en un solo buffer
      const pdfBuffer = Buffer.concat(buffers);

      // Guardar el archivo PDF en el sistema de archivos
      const filePath = "../../descarga.pdf";
      fs.writeFileSync(filePath, pdfBuffer);

      // Enviar el archivo PDF como respuesta
      res.contentType("application/pdf");
      res.send(fs.readFileSync(filePath));
    });

    doc.end();
  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = {
  createCarga,
  createUnloading,
  getAllCargas,
  getAllDescargas,
  getAllExports,
  csvCharges,
  csvDescargas,
  documentPdf,
};
