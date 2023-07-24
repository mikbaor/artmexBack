const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
var converter = require('number-to-words');
require("./sliceText")

function mmToPo(number) {
  return number * 2.83465
}
function roundToCentenary(number) {
  if (number <= 510) {
    console.log("Entro pre");
    return 510
  } else {
    // let divi = 0
    // if (number > 1000) {
    //   divi = (number / 20)
    // }
    // return number - divi
    return number
  }

}

async function ticketDetailSale58mm({ tarimas, saleDetail, boxes, saleId, functionRes, res }) {
  try {

    //ANTES DE LA CREACION DEL DOC
    //TARIMAS
    let TOTAL_PRICE = 0
    let TOTAL_ITEMS = 0
    tarimas?.forEach(ele => {
      TOTAL_PRICE += ele.tarima_price
      TOTAL_ITEMS++
    });
    boxes?.forEach(ele => {
      TOTAL_PRICE += ele.dollarCost
      TOTAL_ITEMS += ele.boxes_count
    });

    /* CREACION DEL DOC */
    //width = 226.772
    //Medidas margen
    const WIDTH_DOC = mmToPo(58)
    const WIDTH_INICIO = 7
    const WIDTH_FIN = WIDTH_DOC - 7
    const IVA = 5.0
    const FONT_SIZE = 9
    const pre_Height = (510 + (TOTAL_ITEMS * 8.5))
    console.log(pre_Height);
    const HEIGHT_PAGE = roundToCentenary(pre_Height)
    console.log(HEIGHT_PAGE);
    let doc = new PDFDocument({ size: [WIDTH_DOC, HEIGHT_PAGE] });

    //LOGO
    const logoImage = path.join(__dirname, "./../../../../uploads/assets/images/logo.png");

    //Datos de la empresa
    const y_init = 20
    let y = y_init
    const SpacingLineY1 = 10

    //LOGO
    doc.image(
      logoImage,
      (WIDTH_FIN + WIDTH_INICIO) / 8,
      y_init - 7,
      {
        width: (WIDTH_FIN + WIDTH_INICIO) / 5,
        height: (WIDTH_FIN + WIDTH_INICIO) / 5
      }
    );

    //titulo
    doc.font("Helvetica-Bold")
    const tittle = "Wholesale"
    const widthTittle = doc.widthOfString(
      tittle,
      { align: "center", characterSpacing: 0.4, wordSpacing: 0.8 }
    );
    const posicionX1 = (WIDTH_DOC - widthTittle) / 2;
    doc.fontSize(11).text(tittle, ((WIDTH_FIN + WIDTH_INICIO) / 8) + 51, y_init, { lineBreak: false });
    //subtittle
    doc.fontSize(9).font("Helvetica-Bold")
    const subtittle = "Chicago & New York";
    const widthSubtittle = doc.widthOfString(
      subtittle,
      { align: "center", characterSpacing: 0.4, wordSpacing: 0.8 }
    );
    const posicionX2 = (WIDTH_DOC - widthSubtittle) / 2;
    doc.fontSize(8).text(subtittle, ((WIDTH_FIN + WIDTH_INICIO) / 8) + 40, y_init + 12, { lineBreak: false, characterSpacing: 0.1 });

    //espacio entre cada palabra

    //LINEA 1
    y += SpacingLineY1 + 35
    const direcc = `5701 West Ogden Ave Cicero, Illinois, Zip 60804
Cell phone: 630 842 4166`

    doc.font("Helvetica").fontSize(FONT_SIZE).text(
      direcc,
      WIDTH_INICIO,
      y,
      {
        width: (WIDTH_FIN - (WIDTH_INICIO)),
        characterSpacing: 0.1,
        wordSpacing: 0.1,
        align: "center"
      }
    )

    //Linea 2
    y += SpacingLineY1 + 25
    const numOrder = `Order #${saleId ?? "pro"}`

    doc.font("Helvetica").fontSize(FONT_SIZE).text(
      numOrder,
      WIDTH_INICIO,
      y,
      {
        width: (WIDTH_FIN - (WIDTH_INICIO)),
        characterSpacing: 0.1,
        wordSpacing: 0.1,
        align: "center"
      }
    )

    //Linea 3
    y += SpacingLineY1 + 10
    const day1 = `${saleDetail.date.getDate()}/${saleDetail.date.getMonth() + 1}/${saleDetail.date.getFullYear()}`
    const hour1 = `${saleDetail.date.getHours()}:${saleDetail.date.getMinutes()}:${saleDetail.date.getSeconds()}`;
    const fecha = `${hour1} - ${day1}`

    doc.font("Helvetica").fontSize(FONT_SIZE).text(
      fecha,
      WIDTH_INICIO,
      y,
      {
        width: (WIDTH_FIN - (WIDTH_INICIO)),
        characterSpacing: 0.1,
        wordSpacing: 0.1,
        align: "center"
      }
    )

    //CUSTOMER
    y += SpacingLineY1 + 10
    const customer = `customer: ${saleDetail.client_name}`
    doc.font("Helvetica").fontSize(FONT_SIZE).text(
      customer,
      WIDTH_INICIO,
      y,
      {
        width: (WIDTH_FIN - (WIDTH_INICIO)),
        characterSpacing: 0.1,
        wordSpacing: 0.1,
      }
    )
    //address
    //CUSTOMER
    y += SpacingLineY1 + 10
    const customer_addres = `address: ${saleDetail.client_address}`
    doc.font("Helvetica").fontSize(FONT_SIZE).text(
      customer_addres,
      WIDTH_INICIO,
      y,
      {
        width: (WIDTH_FIN - (WIDTH_INICIO)),
        characterSpacing: 0.1,
        wordSpacing: 0.1,
      }
    )



    //PRODUCTS
    //ENCABEZADO
    y += SpacingLineY1 + 15
    doc.fontSize(FONT_SIZE).text(
      "ID",
      WIDTH_INICIO,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )
    doc.fontSize(FONT_SIZE).text(
      "ARTICLE",
      WIDTH_INICIO + 30,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )
    doc.fontSize(FONT_SIZE).text(
      "TOTAL",
      WIDTH_INICIO + 100,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )


    //FOR TARIMAS
    for (let i = 0; i < tarimas?.length; i++) {
      if (i === 0) {
        y += SpacingLineY1 - 2
      } else {
        y += SpacingLineY1 - 2
      }
      let tarima = tarimas[i]
      doc.fontSize(FONT_SIZE).text(
        tarima.tarima_id,
        WIDTH_INICIO,
        y,
        { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
      )
      doc.fontSize(FONT_SIZE).text(
        "tarima",
        WIDTH_INICIO + 30,
        y,
        { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
      )
      doc.fontSize(FONT_SIZE).text(
        "$",
        WIDTH_INICIO + 95,
        y,
        { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
      )
      doc.fontSize(FONT_SIZE).text(
        tarima.tarima_price.toFixed(2),
        WIDTH_INICIO + 100,
        y,
        { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
      )

    }
    //CAJAS SUELTAS
    for (let i = 0; i < boxes?.length; i++) {
      y += SpacingLineY1 - 2
      let box = boxes[i]
      doc.fontSize(FONT_SIZE).text(
        box.id,
        WIDTH_INICIO,
        y,
        { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
      )
      doc.fontSize(FONT_SIZE).text(
        box.boxes_count + " box",
        WIDTH_INICIO + 30,
        y,
        { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
      )
      doc.fontSize(FONT_SIZE).text(
        "$",
        WIDTH_INICIO + 95,
        y,
        { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
      )
      doc.fontSize(FONT_SIZE).text(
        box.dollarCost.toFixed(2),
        WIDTH_INICIO + 100,
        y,
        { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
      )

    }


    //TOTAL
    y += SpacingLineY1 + 10
    doc.fontSize(FONT_SIZE).text(
      "TOTAL",
      WIDTH_INICIO,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )
    doc.fontSize(FONT_SIZE).text(
      "$",
      WIDTH_INICIO + 90,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )
    TOTAL_PRICE = TOTAL_PRICE.toFixed(2)
    doc.fontSize(FONT_SIZE).text(
      TOTAL_PRICE,
      WIDTH_INICIO + 95,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )

    //TOTAL EN TEXTO
    doc.fontSize(FONT_SIZE)
    const totalWord = converter.toWords(TOTAL_PRICE)
    y += SpacingLineY1 + 10
    doc.text(
      totalWord,
      WIDTH_INICIO,
      y,
      {
        width: (WIDTH_FIN - WIDTH_INICIO),
        align: "center",
        characterSpacing: 0.2,
        wordSpacing: 0.1
      }
    );

    doc.fontSize(FONT_SIZE)

    //depende del tamaño del numero
    if (totalWord?.length > 40) {
      y += SpacingLineY1 + 20
    }


    //LINEA PARA EL IVA
    doc.rect(
      WIDTH_INICIO,
      y += SpacingLineY1 + 10,
      WIDTH_FIN - WIDTH_INICIO,
      0.4)
      .fill("#656565")
    doc.rect(0, 0, 0, 0).fill("#000000")


    //IVA
    y += 5
    doc.fontSize(FONT_SIZE).text(
      "IVA",
      WIDTH_INICIO,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )
    doc.fontSize(FONT_SIZE).text(
      `${IVA}%`,
      WIDTH_INICIO + 30,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )
    const TOTAL_PRICE_IVA_APPLICATION = (TOTAL_PRICE - ((TOTAL_PRICE * IVA) / 100)).toFixed(2)
    // doc.fontSize(FONT_SIZE).text(
    //   `$ ${TOTAL_PRICE_IVA_APPLICATION}`,
    //   WIDTH_INICIO + 55,
    //   y,
    //   { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    // )
    const MONT_IVA = ((TOTAL_PRICE * IVA) / 100).toFixed(2)
    doc.fontSize(FONT_SIZE).text(
      `$`,
      WIDTH_INICIO + 95,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )
    doc.fontSize(FONT_SIZE).text(
      `${MONT_IVA}`,
      WIDTH_INICIO + 100,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )
    //LINEA PARA EL IVA
    doc.rect(
      WIDTH_INICIO,
      y += 9,
      WIDTH_FIN - WIDTH_INICIO,
      0.4)
      .fill("#656565")

    doc.rect(0, 0, 0, 0).fill("#000000")

    //FINAL IVA
    /*y += SpacingLineY1 - 7
    doc.fontSize(FONT_SIZE).text(
      `$`,
      WIDTH_INICIO + 95,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )
    doc.fontSize(FONT_SIZE).text(
      `${MONT_IVA}`,
      WIDTH_INICIO + 100,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )*/


    //CANTIDAD DE ARTICULOS VENDIDOS
    //linea
    doc.rect(
      WIDTH_INICIO,
      y += SpacingLineY1,
      WIDTH_FIN - WIDTH_INICIO,
      0.4)
      .fill("#656565")
    //texto
    doc.rect(0, 0, 0, 0).fill("#000000")
    const totalItems = `${TOTAL_ITEMS} items sold`
    const widthtoIte = doc.widthOfString(
      totalItems,
      { align: "center" }
    );
    const px_toitem = (WIDTH_DOC - widthtoIte) / 2;

    y += SpacingLineY1 - 4
    doc.text(
      totalItems,
      px_toitem,
      y,
      { lineBreak: false }
    );
    //linea
    doc.rect(
      WIDTH_INICIO,
      y += SpacingLineY1,
      WIDTH_FIN - WIDTH_INICIO,
      0.4)
      .fill("#656565")


    //STATUS PAY
    doc.fill("#000000")
    y += SpacingLineY1 + 10
    doc.text(
      "STATUS PAY:",
      WIDTH_INICIO,
      y,
      { lineBreak: false }
    );
    doc.text(
      `${saleDetail.payment_status}`,
      WIDTH_INICIO + 60,
      y,
      { lineBreak: false }
    );
    //PAYMENT PAY
    y += SpacingLineY1
    doc.text(
      "PAID:",
      WIDTH_INICIO,
      y,
      { lineBreak: false }
    );
    doc.text(
      `$ ${saleDetail?.payment_pay.toFixed(2)}`,
      WIDTH_INICIO + 30,
      y,
      { lineBreak: false }
    );
    //PAYMENT DEBT
    y += SpacingLineY1
    doc.text(
      "DEBT:",
      WIDTH_INICIO,
      y,
      { lineBreak: false }
    );
    doc.text(
      `$ ${saleDetail.payment_debt.toFixed(2)}`,
      WIDTH_INICIO + 30,
      y,
      { lineBreak: false }
    );



    //FINAL
    y += SpacingLineY1 + 30
    const textF = `Thank you for shopping with us.`
    doc.fontSize(FONT_SIZE).text(
      textF,
      WIDTH_INICIO,
      y,
      {
        width: (WIDTH_FIN - (WIDTH_INICIO)),
        characterSpacing: 0.2,
        wordSpacing: 0.1,
        align: "center"
      }
    )
    //web
    y += SpacingLineY1 + 10
    const textWeb = `www.artmeximportscorp.com`
    doc.fontSize(FONT_SIZE).font("Helvetica-Bold").text(
      textWeb,
      WIDTH_INICIO,
      y,
      {
        width: (WIDTH_FIN - (WIDTH_INICIO)),
        characterSpacing: 0.2,
        wordSpacing: 0.1,
        align: "center"
      }
    )


    /********************************************************************************** */
    //GENERANDO EL PDF EN MEMORIA
    // Generar el archivo PDF en memoria

    const buffers = [];
    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => {
      // Combinar los fragmentos del buffer en un solo buffer
      const pdfBuffer = Buffer.concat(buffers);
      const namePath = `pdf_sale${saleId}.pdf`
      const filePath = path.join(__dirname, `./../../../../uploads/pdf/sales/${namePath}`);
      // Guardar el archivo PDF en el sistema de archivos
      fs.writeFileSync(filePath, pdfBuffer);

      //ejectuamos la callback en la que viene lo que queremos hacer

      functionRes({
        res: res,
        filePath: filePath,
        namePath: namePath
      })

    });
    doc.end()

  } catch (error) {
    console.log("*** Error: **********");
    console.log(error);
    console.log("*** Error: **********");
    throw new Error(error)
  }
}



module.exports = ticketDetailSale58mm
