const {
  //modelos
  User,
  Box,
  Tarima,
  Substore,
  Store,
  Desentarimado,
  Printer
} = require("../connection/db");
const { conn } = require("../connection/db");
const {desentarimar} = require("../handlers/desentarimar")
const { ZPL_LOGO, madeInMexico } = require("../helpers/logo");

const createTarima = async (req, res) => {
  const { date, weight, height, userId, boxes, substoreId, printerId, detailTarima, large,wide } = req.body;

  const t = await conn.transaction();

  try {
    const substore = await Substore.findByPk(substoreId, { transaction: t });
    const newUser = await User.findByPk(userId, { transaction: t });
    const newTarima = await Tarima.create(
      {
        height,
        weight,
        large,
        wide,
        date,
        detailTarima
      },
      { transaction: t }
    );

    const printer = await Printer.findByPk(printerId, { transaction: t })

    await newTarima.setPrinter(printer, { transaction: t })

    const detail = (index1, index2) => {
      return detailTarima.slice(index1, index2).length > 0
        ? detailTarima.slice(index1, index2)
        : "";
    };

      const dateEtiqueta = date.split("T");
    
      const dateLabel = new Date(dateEtiqueta[0])

    const tar1 = `
    ^XA
    ^FO100,195^A0N,50,50^FWB^FDContent :^FS
    ^FO170,150^A0N,200,200^FWB^FD${boxes.length}^FS
    ^FO180,100^A0N,50,50^FWI^FDBoxes^FS
    ^FO340,250^A0N,20,30^FWB^FDPacked on:^FS
    ^FO340,85^A0N,20,30^FWB^FD${dateLabel.getUTCDate()}/${
      dateLabel.getUTCMonth() + 1
    }/${dateLabel.getUTCFullYear()}^FS
    ^FO375,343^A0N,20,30^FWB^FDby:^FS
    ^FO375,85^A0N,20,30^FWB^FD${newUser.firstName}^FS
    ^FO445,77^A0N,25,35^FWB^FDAuthentic product of ^FS
    ^FO475,80^A0N,25,35^FWB^FDArt Mex Imports Corp^FS
    ^FO560,125^BQN,2,10^FDQA,TAR${newTarima.id}^FS
    ^FO560,90^A0N,40,40^FWN^FDTAR${newTarima.id}^FS
    ^FO75,810^A0N,70,50^FWB^FDArt Mex^FS
    ^FO150,755^A0N,70,40^FWB^FDImports Corp^FS
    {{logo}}
    ^FO165,510^A0N,30,40^FWB^FDComments:^FS
    ^FO195,442^GB4,250,2^FS
    ^FO200,442^A0N,16,24^FWB^FD${detail(0, 21)}^FS
    ^FO224,442^A0N,16,24^FWB^FD${detail(21, 41)}^FS
    ^FO248,442^A0N,16,24^FWB^FD${detail(41, 61)}^FS
    ^FO272,442^A0N,16,24^FWB^FD${detail(61, 81)}^FS
    ^FO296,442^A0N,16,24^FWB^FD${detail(81, 101)}^FS
    ^FO320,442^A0N,16,24^FWB^FD${detail(101, 121)}^FS
    ^FO344,442^A0N,16,24^FWB^FD${detail(121, 141)}^FS
    ^FO368,442^A0N,16,24^FWB^FD${detail(141, 161)}^FS
    ^FO392,442^A0N,16,24^FWB^FD${detail(161, 181)}^FS
    ^FO416,442^A0N,16,24^FWB^FD${detail(181, 201)}^FS
    ^FO440,442^A0N,16,24^FWB^FD${detail(201, 221)}^FS
    ^FO464,442^A0N,16,24^FWB^FD${detail(221, 241)}^FS
    ^FO488,442^A0N,16,24^FWB^FD${detail(241, 261)}^FS
    ^FO512,442^A0N,16,24^FWB^FD${detail(261, 281)}^FS
    ^FO536,442^A0N,16,24^FWB^FD${detail(281, 301)}^FS
    ^FO560,442^A0N,16,24^FWB^FD${detail(301, 321)}^FS
    ^FO584,442^A0N,16,24^FWB^FD${detail(321, 341)}^FS
    ^FO608,442^A0N,16,24^FWB^FD${detail(341, 361)}^FS
    ^FO632,442^A0N,16,24^FWB^FD${detail(361, 381)}^FS
    ^FO656,442^A0N,16,24^FWB^FD${detail(381, 401)}^FS  
    ^FO745,820^A0N,35,50^FWB^FD${weight}^FS
    ^FO745,760^A0N,35,50^FWB^FDKg^FS
    ^FO715,1090^A0N,20,30^FWB^FDHigh:^FS
    ^FO715,1000^A0N,20,30^FWB^FD${height}^FS
    ^FO715,960^A0N,20,30^FWB^FDcm^FS
    ^FO745,1090^A0N,20,30^FWB^FDWidth:^FS
    ^FO745,1000^A0N,20,30^FWB^FD${wide}^FS
    ^FO745,960^A0N,20,30^FWB^FDcm^FS
    ^FO775,1090^A0N,20,30^FWB^FDLength:^FS
    ^FO775,1000^A0N,20,30^FWB^FD${large}^FS
    ^FO775,960^A0N,20,30^FWB^FDcm^FS
    ^FO50,50^GB750,350,8^FS
    ^FO50,420^GB750,300,5^FS
    {{img}}
    ^XZ`;
    
    
    const zplLogo = tar1.replace("{{logo}}", ZPL_LOGO)
    const zplLogoMexico = zplLogo.replace("{{img}}", madeInMexico)

    

    const zplsinSalto = zplLogoMexico.replace(/\n/g, "");

    if (boxes) {
      const boxesTarima = await Promise.all(
        boxes.map(async (box) => {
          let boxObj = await Box.findByPk(box.id, { transaction: t });
          const desSubstore = await boxObj.getSubstore({ transaction: t });
          if (!desSubstore) {
            throw new Error("Esta caja no está vinculada a ningún subalmacén");
          }
          await desSubstore.removeBox(boxObj, { transaction: t });

          await newTarima.setBoxes(boxObj, { transaction: t });

          return boxObj;
        })
      );

      await newTarima.setUser(newUser, { transaction: t });
      await newTarima.update({ etiqueta: zplsinSalto }, { transaction: t });
      await newTarima.setSubstore(substore, { transaction: t });
    } else {
      throw new Error("No hay cajas para crear la tarima");
    }

    await t.commit();

    const tarima = await Tarima.findByPk(newTarima.id, {
      attributes: ["id", "date", "weight", "height", "etiqueta"],
      include: [
        {
          model: User,
          attributes: ["firstName", "userName", "id"],
        },
        {
          model: Substore,
        },
        {
          model: Box,
          attributes: ["id"],
        },
        {
          model:Printer
        }
      ],
    });

    res.status(200).json(tarima);
  } catch (error) {
    if (t.finished !== "commit" && t.finished !== "rollback") {
      await t.rollback();
    }
    console.log(error.message);
    res
      .status(404)
      .json({ message: "error al crear la tarima", detail: error.message });
  }
};

const getAllTarimas = async (req, res) => {
  const { tarimaId, userId, userName, boxId, storeId } = req.body;

  const whereTarima = {};
  const whereUser = {};
  const whereBox = {};
  const whereStore = {}

  if (tarimaId) whereTarima.id = tarimaId;
  if (userId) whereUser.id = userId;
  if (userName) whereUser.userName = userName;
  if (boxId) whereBox.id = boxId;
  if (storeId) whereStore.id = storeId

  try {
    const tarimas = await Tarima.findAll({
      attributes:[
        "id",
        "date",
        "weight",
        "height",        
        "isImpress",
        "isScaned",
        "reimpressionAmmount",
        "detailTarima"
      ],
      where: whereTarima,
      include: [
        {
          model: User,        
          where: whereUser,
        },
        {
          model: Box,
          attributes: ["id"],
          where: whereBox,
        },
        {
          model: Substore,
          include:[
            {
              model:Store,
              where: whereStore
            }
          ]
        }
      ],
      order: [["id", "DESC"]],
    });

    res.status(200).json(tarimas);
  } catch (error) {
    console.log(error.message);
    res
      .status(404)
      .json({ message: "error al obtener las tarimas", detail: error.message });
  }
};



const desentarimado = async (req, res) => {
  const { boxes, boxesAmmount, date, depositId, UserId } = req.body;

  try {
    const result = await desentarimar(boxes, boxesAmmount, date, depositId, UserId);

    res.status(202).json({ message: "Desentarimado Ok", result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const getTarimaById = async (req, res) => {
  const { id } = req.params;
  try {
    const tarima = await Tarima.findByPk(id, {
      attributes: [
        "id",
        "date",
        "weight",
        "height",
        "etiqueta",
        "SubstoreId",
        "TransitId",
      ],
      include: [
        {
          model: User,
          attributes: ["firstName", "userName", "id"],
        },
        {
          model: Box,
          attributes: ["id", "dollarCost"],
        },
        {
          model: Substore,
          attributes: ["id"],
          include: [
            {
              model: Store,
              attributes: ["id"],
            },
          ],
        },
      ],
    });   

    if (!tarima) {
      return res.status(200).json({ message: "La tarima no existe" });
    }

    let costo = 0
    tarima.dataValues.Boxes.forEach(box=>{
     costo = costo+box.dataValues.dollarCost
    })
    
    res.status(200).json({tarima, cost: costo});
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Error al buscar la tarima", detail: error.message });
  }
};



module.exports = {
  createTarima,
  getAllTarimas,
  getTarimaById,  
  desentarimado,
};
