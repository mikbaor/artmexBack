const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
var converter = require('number-to-words');

require("./sliceText")

function mmToPo(number) {
  return number * 2.83465
}
function roundToCentenary(number) {
  if (number <= 500) {
    console.log("Entro pre");
    return 500
  } else {
    let divi = 0
    if (number > 800) {
      divi = (number / 10)
    }
    return number - divi
  }

}

async function ticketDetailSale80mm({ tarimas, saleDetail, boxes, res }) {
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
    const WIDTH_DOC = mmToPo(80)
    const WIDTH_INICIO = 20
    const WIDTH_FIN = WIDTH_DOC - 20
    const IVA = 5.0
    const FONT_SIZE = 8
    const pre_Height = (500 + (TOTAL_ITEMS * 8.7))
    console.log(pre_Height);
    const HEIGHT_PAGE = roundToCentenary(pre_Height)
    console.log(HEIGHT_PAGE);
    const doc = new PDFDocument({ size: [WIDTH_DOC, HEIGHT_PAGE] });

    //titulo
    const y_init = 30
    doc.font("Courier")
    const tittle = "Artmex imports"
    const widthTittle = doc.widthOfString(
      tittle,
      { align: "center", characterSpacing: 0.4, wordSpacing: 0.8 }
    );
    const posicionX1 = (WIDTH_DOC - widthTittle) / 2;
    doc.fontSize(14).text(tittle, posicionX1, y_init, { lineBreak: false });


    //espacio entre cada palabra

    //Datos de la empresa
    let y = y_init
    //LINEA 1
    y += 25
    doc.fontSize(FONT_SIZE).text(
      "ARTMEX IMPORTS CORP DE RL DE cv",
      WIDTH_INICIO,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )
    //LINEA 2
    const SpacingLineY1 = 12
    y += SpacingLineY1
    doc.fontSize(FONT_SIZE).text(
      "NEXTENGO 78 STA.CRUZ ACAVUCAN 02770",
      WIDTH_INICIO,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )
    //LINEA 3
    y += SpacingLineY1
    doc.fontSize(FONT_SIZE).text(
      "A2CAPOTZALCO MEX CDMX RFC.NWM9709244W4",
      WIDTH_INICIO,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )
    y += SpacingLineY1 / 2
    doc.fontSize(FONT_SIZE).text(
      "UNIDAO COLON",
      WIDTH_INICIO,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )

    //line 4
    y += SpacingLineY1
    doc.fontSize(FONT_SIZE).text(
      "PERIF SUR7835COL STAMA TEOUEPEXPAN",
      WIDTH_INICIO,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )

    //line5
    y += SpacingLineY1
    doc.fontSize(FONT_SIZE).text(
      "QUEJAS V SUGERENCIAS BOO OOD 0096",
      WIDTH_INICIO,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )
    y += SpacingLineY1 / 2
    doc.fontSize(FONT_SIZE).text(
      "REGIMEN FISCAL - 601",
      WIDTH_INICIO,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )

    //line 5
    y += SpacingLineY1
    doc.fontSize(FONT_SIZE).text(
      "GENERAL OE LEY PERSONASMORALES VENTA",
      WIDTH_INICIO,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )
    y += SpacingLineY1 / 2
    doc.fontSize(FONT_SIZE).text(
      "EN LINEA 8009256278",
      WIDTH_INICIO,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )


    //PRODUCTS
    //ENCABEZADO
    y += SpacingLineY1 + 5
    doc.fontSize(FONT_SIZE).text(
      "QTY",
      WIDTH_INICIO,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )
    doc.fontSize(FONT_SIZE).text(
      "ID",
      WIDTH_INICIO + 20,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )
    doc.fontSize(FONT_SIZE).text(
      "ARTICLE",
      WIDTH_INICIO + 50,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )
    doc.fontSize(FONT_SIZE).text(
      "TOTAL",
      WIDTH_INICIO + 133,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )


    //FOR TARIMAS
    for (let i = 0; i < tarimas?.length; i++) {
      if (i === 0) {
        y += SpacingLineY1 - 2
      } else {
        y += SpacingLineY1 - 5
      }
      let tarima = tarimas[i]
      doc.fontSize(FONT_SIZE).text(
        1,
        WIDTH_INICIO,
        y,
        { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
      )
      doc.fontSize(FONT_SIZE).text(
        tarima.tarima_id,
        WIDTH_INICIO + 20,
        y,
        { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
      )
      doc.fontSize(FONT_SIZE).text(
        "tarima",
        WIDTH_INICIO + 50,
        y,
        { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
      )
      doc.fontSize(FONT_SIZE).text(
        "$",
        WIDTH_INICIO + 133,
        y,
        { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
      )
      doc.fontSize(FONT_SIZE).text(
        tarima.tarima_price.toFixed(2),
        WIDTH_INICIO + 140,
        y,
        { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
      )

    }
    //CAJAS SUELTAS
    for (let i = 0; i < boxes?.length; i++) {
      y += SpacingLineY1 - 5
      let box = boxes[i]
      doc.fontSize(FONT_SIZE).text(
        box.boxes_count,
        WIDTH_INICIO,
        y,
        { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
      )
      doc.fontSize(FONT_SIZE).text(
        box.id,
        WIDTH_INICIO + 20,
        y,
        { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
      )
      doc.fontSize(FONT_SIZE).text(
        "box",
        WIDTH_INICIO + 50,
        y,
        { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
      )
      doc.fontSize(FONT_SIZE).text(
        "$",
        WIDTH_INICIO + 133,
        y,
        { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
      )
      doc.fontSize(FONT_SIZE).text(
        box.dollarCost.toFixed(2),
        WIDTH_INICIO + 140,
        y,
        { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
      )

    }


    //TOTAL
    y += SpacingLineY1 + 5
    doc.fontSize(FONT_SIZE).text(
      "TOTAL",
      WIDTH_INICIO,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )
    doc.fontSize(FONT_SIZE).text(
      "$",
      WIDTH_INICIO + 133,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )
    TOTAL_PRICE = TOTAL_PRICE.toFixed(2)
    doc.fontSize(FONT_SIZE).text(
      TOTAL_PRICE,
      WIDTH_INICIO + 140,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )

    //TOTAL EN TEXTO
    doc.fontSize(FONT_SIZE)
    const totalWord = converter.toWords(TOTAL_PRICE)
    y += SpacingLineY1 + 2
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
    if (totalWord?.length > 65) {
      y += SpacingLineY1 - 4
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
    doc.fontSize(FONT_SIZE).text(
      `$ ${TOTAL_PRICE_IVA_APPLICATION}`,
      WIDTH_INICIO + 55,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )
    const MONT_IVA = ((TOTAL_PRICE * IVA) / 100).toFixed(2)
    doc.fontSize(FONT_SIZE).text(
      `$`,
      WIDTH_INICIO + 133,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )
    doc.fontSize(FONT_SIZE).text(
      `${MONT_IVA}`,
      WIDTH_INICIO + 140,
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
    y += SpacingLineY1 - 7
    doc.fontSize(FONT_SIZE).text(
      `$`,
      WIDTH_INICIO + 133,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )
    doc.fontSize(FONT_SIZE).text(
      `${MONT_IVA}`,
      WIDTH_INICIO + 140,
      y,
      { lineBreak: false, characterSpacing: 0.2, wordSpacing: 0.2 }
    )


    //CANTIDAD DE ARTICULOS VENDIDOS
    const totalItems = `${TOTAL_ITEMS} items sold`
    const widthtoIte = doc.widthOfString(
      totalItems,
      { align: "center" }
    );
    const px_toitem = (WIDTH_DOC - widthtoIte) / 2;

    y += SpacingLineY1
    doc.text(
      totalItems,
      px_toitem,
      y,
      { lineBreak: false }
    );

    //CLIENTE
    y += SpacingLineY1 + 5
    doc.text(
      "CLIENT:",
      WIDTH_INICIO,
      y,
      { lineBreak: false }
    );
    doc.text(
      String(saleDetail.client_name).sliceName(),
      WIDTH_INICIO + 40,
      y,
      { lineBreak: false }
    );
    //DATE
    y += SpacingLineY1
    const day = `${saleDetail.date.getDate()}/${saleDetail.date.getMonth() + 1}/${saleDetail.date.getFullYear()}`
    const hour = `${saleDetail.date.getHours()}:${saleDetail.date.getMinutes()}:${saleDetail.date.getSeconds()}`;
    doc.text(
      "DATE:",
      WIDTH_INICIO,
      y,
      { lineBreak: false }
    );
    doc.text(
      `${hour} ${day}`,
      WIDTH_INICIO + 30,
      y,
      { lineBreak: false }
    );
    //STATUS PAY
    y += SpacingLineY1
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
    y += SpacingLineY1 + 15
    const textF = `ASHI MORE THAN EFFECTIVE ll-A APP THAT HECOMPENDS YOURCOMPASlOBTEN 2% OF 
    BONUS WHEN YOU MAKE 1U. PAYMENT`

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



    /********************************************************************************** */
    //GENERANDO EL PDF EN MEMORIA
    // Generar el archivo PDF en memoria
    const buffers = [];
    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => {
      // Combinar los fragmentos del buffer en un solo buffer
      const pdfBuffer = Buffer.concat(buffers);

      // Guardar el archivo PDF en el sistema de archivos
      const filePath = path.join(__dirname, "./pdf_momentaneo.pdf");
      fs.writeFileSync(filePath, pdfBuffer);

      const newPdf = fs.readFileSync(filePath)
      fs.unlinkSync(filePath);

      // Enviar el archivo PDF como respuesta
      res.contentType("application/pdf");
      res.send(newPdf);
    });

    doc.end();
  } catch (error) {
    console.log("*** Error: **********");
    console.log(error);
    console.log("*** Error: **********");
    throw new Error(error)
  }
}



module.exports = ticketDetailSale80mm