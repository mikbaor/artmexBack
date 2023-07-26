const {
  User,
  Sale,
  Microsale,
  Product,
  Box,
  Client,
  Payment,
  Tarima,
  Micropayment,
  Pricebox,
  Boxammount,
  Salephotos,
  conn,
} = require("../connection/db");
/*const { tarimasAcajas } = require("../handlers/desentarimar");
const { Op } = require("sequelize");
const { uploadImageSales } = require("./uploadImagesController");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;*/
const fs = require("fs");
const path = require("path");
const servicesPdf = require("./../services/pdf")
const querySales = require("./querys/sale");
const { QueryTypes, where } = require("sequelize");
const emailTicketSale = require("../services/nodemailer/ticketSale");

/*
const createSale = async (req, res) => {
  const {
    userId,
    date,
    microBoxSales,
    tarimas,
    totalCost,
    clientId,
    totalAmmountPay,
    OrderExist,
    priceboxId,
    taxPercentage,
    taxAmmount,
    ammountWTax,
    change,
    paymentMethods,
  } = req.body;

  const transaction = await conn.transaction();

  try {
    const newSale = await Sale.create(
      {
        date,
        totalCost,
        taxPercentage,
        taxAmmount,
        ammountWTax,
        change,
      },
      { transaction }
    );

    for (const payment of paymentMethods) {
      const newPaymentMethod = await Paymentmethod.create(
        {
          ammount: payment.ammount,
          paymentMethod: payment.paymentMethod,
        },
        { transaction }
      );

      await newPaymentMethod.setSale(newSale, { transaction });
      await newSale.addPaymentmethods(newPaymentMethod, { transaction });
    }

    if (req.files) {
      for (const file of req.files) {
        pathImage = file.path;
        imageSale = `${req.protocol}://${req.get("host")}/${pathImage.replace(
          /\\/g,
          "/"
        )}`;

        const urlCloud = await uploadImageSales(pathImage);

        await fs.unlink(pathImage);

        const imagenesPath = await Salephotos.create(
          {
            path: urlCloud.secure_url,
          },
          { transaction }
        );
        await imagenesPath.setSale(newSale, { transaction });
      }
    }

    const user = await User.findByPk(userId, { transaction });
    const client = await Client.findByPk(clientId, { transaction });

    let cajasIds = [];
    let joinBoxes = [];
    let totalBoxes = 0;
    if (tarimas) {
      for (const tar of tarimas) {
        const tarima = await Tarima.findByPk(tar.id, { transaction });

        const cajasDeTarima = await tarima.getBoxes({
          attributes: ["id"],
        }, { transaction });

        const cajasDeTarimaConRatio = cajasDeTarima.map((cajaId) => ({
          boxId: cajaId.dataValues.id,
          ratio: tar.ratio,
        }));
        cajasIds = cajasIds.concat(cajasDeTarimaConRatio);
      }
      if (microBoxSales) {
        joinBoxes = [...microBoxSales];
      }
      joinBoxes = joinBoxes.concat(cajasIds);
      totalBoxes = joinBoxes.length;
    }

    await Sale.update(
      { totalBoxes },
      { where: { id: newSale.id } },
      { transaction }
    );

    for (const microSale of joinBoxes) {
      const { ratio, boxId } = microSale;

      const box = await Box.findByPk(        
        boxId,
        {         
          include: [
            {
              model: Boxammount,
              include: [
                {
                  model: Product,
                },
              ],
            },
          ],
        },
        { transaction }
      );
  
      const ratioState = await Pricebox.findByPk(priceboxId);

      let priceBox;      

      if (ratio) {
        priceBox = ratio * box.dataValues.dollarCost;
      } else {
        priceBox = ratioState.dataValues.ratio * box.dataValues.dollarCost;
      }

      if (!box) {
        throw new Error("la caja " + boxId + " no existe");
      }

      if (box.itsSell === true) {
        throw new Error("la caja " + box.id + " ya fue vendida");
      }

      const substore = await box.getSubstore({ transaction });
      const transit = await box.getTransit({ transaction });

      if (substore) {
        await substore.removeBox(box, { transaction });
      }

      if (transit) {
        await transit.removeBox(box, { transaction });
      }

      

      for (const boxAmmount of box.Boxammounts) {
        const { ammount, Product: product } = boxAmmount.dataValues;
        const ammountInventory = product.ammount;
        const ammountDispatch = product.ammountDispatch;

        if (OrderExist) {
          await Product.update(
            {
              ammountDispatch: ammountDispatch - ammount,
            },
            {
              where: {
                id: product.id,
              },
              transaction,
            }
          );
        } else {
          await Product.update(
            {
              ammount: ammountInventory - ammount,
            },
            {
              where: {
                id: product.id,
              },
              transaction,
            }
          );
        }
      }

      

     await Box.update(
        {
          itsSell: true,
        },
        {
          where: { id: box.id },          
        },        
        { transaction }
      );

      let newMicroSale;
      if (ratio) {
        newMicroSale = await Microsale.create(
          {
            priceBox,
          },
          { transaction }
        );
      } else {
        newMicroSale = await Microsale.create(
          {
            priceBox,
          },
          { transaction }
        );
      }
      

      await newMicroSale.setSale(newSale, { transaction });
      await newMicroSale.setBox(box, { transaction });
    }

    const payment = await Payment.create(
      {
        tipo: totalCost <= totalAmmountPay ? "unique" : "partial",
        status: totalCost <= totalAmmountPay ? "complete" : "pending",
        totalAmmountPay,
        debtAmmount:
          totalCost <= totalAmmountPay ? 0 : totalCost - totalAmmountPay,
      },
      { transaction }
    );

    await newSale.setUser(user, { transaction });
    await newSale.setClient(client, { transaction });
    await newSale.setPayment(payment, { transaction });

    await transaction.commit();

    const sale = await Sale.findByPk(newSale.id, {
      include: [
        {
          model: User,
        },
        {
          model: Client,
        },
        {
          model: Payment,
        },
        {
          model: Paymentmethod,
        },
        {
          model: Microsale,
          include: [
            {
              model: Box,
              attributes: { exclude: ["etiqueta"] },
              include: [
                {
                  model: Boxammount,
                  include: [
                    {
                      model: Product,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
//

    const saleId = newSale.id;   

    //emailTicketSale()
    const userDetail = await User.findOne({
      where: { id: userId },
    });

    //traemos los querys y hacemos las peticiones
    //tarimas
    let queryTarimas = querySales.getTarimasSale();
    let promiseTarima = conn.query(queryTarimas, {
      replacements: { saleId: saleId },
      type: QueryTypes.SELECT,
    });
    //cajas sueltas
    let queryBoxes = querySales.getSeparateBoxes();
    let promiseBoxe = conn.query(queryBoxes, {
      replacements: { saleId: saleId },
      type: QueryTypes.SELECT,
    });
    //extra details
    let queryDetails = querySales.getDetailClientAndPay();
    let promiseDetail = conn.query(queryDetails, {
      replacements: { saleId: saleId },
      type: QueryTypes.SELECT,
    });

    const [resTarimas, resBoxes, detailSale] = await Promise.all([
      promiseTarima,
      promiseBoxe,
      promiseDetail,
    ]);

    function functionResEmail({ res, filePath, namePath }) {
      //ejecutamos la callback que enviara el email
      emailTicketSale({
        detailUser: detailSale[0],
        filePath: filePath,
        namePath: namePath,
        res: res
      })
    }

    if (detailSale.length) {
      await servicesPdf.ticketDetailSale58mm({
        tarimas: resTarimas,
        saleDetail: detailSale[0],
        boxes: resBoxes,
        saleId: saleId,
        functionRes: functionResEmail,
        res: res,
      });
    } else {
      throw new Error("error in sales detail extraction");
    }   
    
  } catch (error) {
    if (
      transaction.finished !== "commit" &&
      transaction.finished !== "rollback"
    ) {
      await transaction.rollback();
    }
    console.log(error)
    res.status(400).json({ error: error.message });
  }
};

const getAllSales = async (req, res) => {
  const { userId, clientId, statusPayment } = req.query;

  //state agregar

  const whereClause = {};
  const whereStatus = {}
  if (userId) {
    whereClause.UserId = userId;
  }
  if (clientId) {
    whereClause.ClientId = clientId;
  }
  if (statusPayment) {
    whereStatus.status = statusPayment;
  }

  try {
    const sales = await Sale.findAll({
      where: whereClause,
      include: [
        {
          model: User,
        },
        {
          model: Client,
        },
        {
          model: Payment,
          where: whereStatus
        },
        {
          model: Microsale,
          include: [
            {
              model: Box,
              attributes: [id],
              include: [
                {
                  model: Boxammount,
                  include: [
                    {
                      model: Product,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    res.status(200).json(sales);
  } catch (error) {
    console.log(error.message);
    res.status(404).json({
      message: "Error al obtener las ventas",
      errorDetails: error.message,
    });
  }
};


const csvSales = async (req, res) => {
  const { dateStart, dateEnd } = req.body

  const where = {}

  if (dateStart && dateEnd) {
    const startDate = new Date(dateStart)
    const endDate = new Date(dateEnd)

    where.date = {
      [Op.between]: [startDate, endDate]
    }
  }
  try {

    const sales = await Sale.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ["firstName", "lastName", "userName"]
        },
        {
          model: Client,
          attributes: ["nombreDueño", "tiendaNombre", "NombreDelEncargado", "state", "direccion"]
        },
        {
          model: Payment,
          attributes: ["tipo", "status", "totalAmmountPay"]
        },
        {
          model: Microsale,
        },
      ],
      order: [["id", "DESC"]],
      raw: true,
    });

    const csvWriter = createCsvWriter({
      path: "sales.csv",
      header: [
        { id: "id", title: "ID" },
        { id: "title", title: "Title" },
        { id: "date", title: "Date" },
        { id: "totalCost", title: "Total Cost" },
        { id: "PaymentId", title: "Payment ID" },
        { id: "UserId", title: "User ID" },
        { id: "ClientId", title: "Client ID" },
        { id: "OrderId", title: "Order ID" },
        { id: "User.firstName", title: "User First Name" },
        { id: "User.lastName", title: "User Last Name" },
        { id: "User.userName", title: "User Username" },
        { id: "Client.nombreDueño", title: "Client Owner Name" },
        { id: "Client.tiendaNombre", title: "Client Store Name" },
        { id: "Client.NombreDelEncargado", title: "Client Manager Name" },
        { id: "Client.state", title: "Client State" },
        { id: "Client.direccion", title: "Client Address" },
        { id: "Payment.tipo", title: "Payment Type" },
        { id: "Payment.status", title: "Payment Status" },
        { id: "Payment.totalAmmountPay", title: "Payment Total Amount" },
        { id: "Microsales.id", title: "Microsales ID" },
        { id: "Microsales.priceBox", title: "Microsales Price per Box" },
        { id: "Microsales.ratio", title: "Microsales Ratio" },
        { id: "Microsales.SaleId", title: "Microsales Sale ID" },
        { id: "Microsales.BoxId", title: "Microsales Box ID" }
      ]
    });


    await csvWriter.writeRecords(sales);

    res.download("sales.csv")
  } catch (error) {
    res.status(400).json(error.message)

  }


}*/

const pdfTicketSale80mm = async (req, res) => {
  try {
    const saleId = req.body.id

    //traemos los querys y hacemos las peticiones

    //tarimas
    let queryTarimas = querySales.getTarimasSale()
    let promiseTarima = conn.query(queryTarimas, {
      replacements: { saleId: saleId },
      type: QueryTypes.SELECT,
    });
    //cajas sueltas
    let queryBoxes = querySales.getSeparateBoxes()
    let promiseBoxe = conn.query(queryBoxes, {
      replacements: { saleId: saleId },
      type: QueryTypes.SELECT,
    });
    //extra details
    let queryDetails = querySales.getDetailClientAndPay()
    let promiseDetail = conn.query(queryDetails, {
      replacements: { saleId: saleId },
      type: QueryTypes.SELECT,
    });

    const [resTarimas, resBoxes, detailSale] = await Promise.all([promiseTarima, promiseBoxe, promiseDetail])

    //function para resolve
    function functionResPdf({ res, filePath, namePath }) {
      const newPdf = fs.readFileSync(filePath)
      fs.unlinkSync(filePath);

      // Enviar el archivo PDF como respuesta
      res.contentType("application/pdf");
      res.send(newPdf);
    }

    if (detailSale.length) {
      let filePathPdf = await servicesPdf.ticketDetailSale80mm({
        tarimas: resTarimas,
        saleDetail: detailSale[0],
        boxes: resBoxes,
        saleId: saleId,
        functionRes: functionResPdf,
        res: res
      })
    } else {
      throw new Error("error in sales detail extraction")
    }


  } catch (error) {
    res.status(400).json({
      message: "error en extraccion de detalle venta",
      errorDetails: error.message
    })
  }
}

const pdfTicketSale58mm = async (req, res) => {
  try {
    const saleId = req.body.id

    //traemos los querys y hacemos las peticiones

    //tarimas
    let queryTarimas = querySales.getTarimasSale()
    let promiseTarima = conn.query(queryTarimas, {
      replacements: { saleId: saleId },
      type: QueryTypes.SELECT,
    });
    //cajas sueltas
    let queryBoxes = querySales.getSeparateBoxes()
    let promiseBoxe = conn.query(queryBoxes, {
      replacements: { saleId: saleId },
      type: QueryTypes.SELECT,
    });
    //extra details
    let queryDetails = querySales.getDetailClientAndPay()
    let promiseDetail = conn.query(queryDetails, {
      replacements: { saleId: saleId },
      type: QueryTypes.SELECT,
    });

    const [resTarimas, resBoxes, detailSale] = await Promise.all([promiseTarima, promiseBoxe, promiseDetail])


    //function para resolve
    function functionResPdf({ res, filePath, namePath }) {
      const newPdf = fs.readFileSync(filePath)
      fs.unlinkSync(filePath);

      // Enviar el archivo PDF como respuesta
      res.contentType("application/pdf");
      res.send(newPdf);
    }

    if (detailSale.length) {
      await servicesPdf.ticketDetailSale58mm({
        tarimas: resTarimas,
        saleDetail: detailSale[0],
        boxes: resBoxes,
        saleId: saleId,
        functionRes: functionResPdf,
        res: res
      })
    } else {
      throw new Error("error in sales detail extraction")
    }


  } catch (error) {
    res.status(400).json({
      message: "error en extraccion de detalle venta",
      errorDetails: error.message
    })
  }
}

const emailDetailSale80mm = async (req, res) => {
  try {
    const saleId = req.body.saleId
    //solo si envia email en el body se tomara este como destino del email
    //si no se envia se tomara el del cliente defecto
    const email = req.body.email

    //traemos los querys y hacemos las peticiones
    //tarimas
    let queryTarimas = querySales.getTarimasSale()
    let promiseTarima = conn.query(queryTarimas, {
      replacements: { saleId: saleId },
      type: QueryTypes.SELECT,
    });
    //cajas sueltas
    let queryBoxes = querySales.getSeparateBoxes()
    let promiseBoxe = conn.query(queryBoxes, {
      replacements: { saleId: saleId },
      type: QueryTypes.SELECT,
    });
    //extra details
    let queryDetails = querySales.getDetailClientAndPay()
    let promiseDetail = conn.query(queryDetails, {
      replacements: { saleId: saleId },
      type: QueryTypes.SELECT,
    });

    const [resTarimas, resBoxes, detailSale] = await Promise.all([promiseTarima, promiseBoxe, promiseDetail])

    //callback para cuando se termina de crear el pdf
    function functionResEmail({ res, filePath, namePath }) {
      //ejecutamos la callback que enviara el email

      emailTicketSale({
        detailUser: detailSale[0],
        filePath: filePath,
        namePath: namePath,
        res: res,
        email: email ? email : detailSale[0].client_email
      })

    }

    if (detailSale.length) {
      await servicesPdf.ticketDetailSale80mm({
        tarimas: resTarimas,
        saleDetail: detailSale[0],
        boxes: resBoxes,
        saleId: saleId,
        functionRes: functionResEmail,
        res: res
      })
    } else {
      throw new Error("error in sales detail extraction")
    }



  } catch (error) {
    throw new Error(error.message)
  }
}

const emailDetailSale58mm = async (req, res) => {
  try {
    const saleId = req.body.saleId
    //solo si envia email en el body se tomara este como destino del email
    //si no se envia se tomara el del cliente defecto
    const email = req.body.email

    //traemos los querys y hacemos las peticiones
    //tarimas
    let queryTarimas = querySales.getTarimasSale()
    let promiseTarima = conn.query(queryTarimas, {
      replacements: { saleId: saleId },
      type: QueryTypes.SELECT,
    });
    //cajas sueltas
    let queryBoxes = querySales.getSeparateBoxes()
    let promiseBoxe = conn.query(queryBoxes, {
      replacements: { saleId: saleId },
      type: QueryTypes.SELECT,
    });
    //extra details
    let queryDetails = querySales.getDetailClientAndPay()
    let promiseDetail = conn.query(queryDetails, {
      replacements: { saleId: saleId },
      type: QueryTypes.SELECT,
    });

    const [resTarimas, resBoxes, detailSale] = await Promise.all([promiseTarima, promiseBoxe, promiseDetail])
    console.log("*********** CONTROLLER *********************");
    console.log(detailSale[0].client_email);
    console.log("********************************");
    //callback para cuando se termina de crear el pdf
    function functionResEmail({ res, filePath, namePath }) {
      //ejecutamos la callback que enviara el email

      emailTicketSale({
        detailUser: detailSale[0],
        filePath: filePath,
        namePath: namePath,
        res: res,
        email: email ? email : detailSale[0].client_email
      })

    }

    if (detailSale.length) {
      await servicesPdf.ticketDetailSale58mm({
        tarimas: resTarimas,
        saleDetail: detailSale[0],
        boxes: resBoxes,
        saleId: saleId,
        functionRes: functionResEmail,
        res: res
      })
    } else {
      throw new Error("error in sales detail extraction")
    }



  } catch (error) {
    throw new Error(error.message)
  }
}


module.exports = {
  /*createSale,
  getAllSales,
  csvSales,*/
  pdfTicketSale80mm,
  pdfTicketSale58mm,
  emailDetailSale80mm,
  emailDetailSale58mm
};
