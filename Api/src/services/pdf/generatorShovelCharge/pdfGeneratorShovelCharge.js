const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const cutArrayProducts = require("./cutArrayProducts.js");
require("./sliceText.js")

async function pdfShovelCharge({idShovelCharge, detailShovel, res, dataTable}){



    const qrData = `EMB${idShovelCharge}`;
    const qrImagePath = path.join(__dirname, `./../../../../uploads/imagesQr/qr_${idShovelCharge}.png`);
    try {
        
    await QRCode.toFile(qrImagePath, qrData);
    
    const doc = new PDFDocument();

    const imagePath = path.join(__dirname, "./../../../../uploads/logo.png");
    const imagePath2 = path.join(
      __dirname,
      `./../../../../uploads/imagesQr/qr_${idShovelCharge}.png`
    );

    doc.image(imagePath, 95, 25, { width: 85, height: 85 });

    doc.image(imagePath2, 400, 100, { width: 175, height: 175 });

    doc.font("Helvetica-Bold").fontSize(24);
    // Agregar título
    doc.text(`Detalles de EMB${idShovelCharge}`, { align: "center" });

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
        `${detailShovel.chofer}`
      );
      // .text(
      //   `${carga.dataValues.Chofer.dataValues.firstName} ${carga.dataValues.Chofer.dataValues.lastName}`
      // );
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(`Placa del Trailer:`, { continued: true })
      .font("Helvetica")
      .text(`${detailShovel.placa}`);
      //.text(`${carga.dataValues.Trailer.dataValues.placaCode}`);
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Bodega de Salida:", { continued: true })
      .font("Helvetica")
      .text(`${detailShovel.store}`);
      //.text(carga.dataValues.Store.dataValues.name);
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Pais:", { continued: true })
      .font("Helvetica")
      .text(`${detailShovel.country}`);
      //.text(carga.dataValues.Store.dataValues.country);
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Estado:", { continued: true })
      .font("Helvetica")
      .text(`${detailShovel.state}`);
      //.text(carga.dataValues.Store.dataValues.state);
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Ciudad:", { continued: true })
      .font("Helvetica")
      .text(`${detailShovel.city}`);
      //.text(carga.dataValues.Store.dataValues.city);
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Direccion:", { continued: true })
      .font("Helvetica")
      .text(`${detailShovel.address}`);
      //.text(carga.dataValues.Store.dataValues.address);

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
      .text(detailShovel.destiny_store);
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(`Pais:`, { continued: true })
      .font("Helvetica")
      .text(detailShovel.destiny_country);
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Estado:", { continued: true })
      .font("Helvetica")
      .text(detailShovel.destiny_state);
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Direccion:", { continued: true })
      .font("Helvetica")
      .text(detailShovel.destiny_address);

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
      .text(`${detailShovel.tarimasAmmount}`);
      //.text(carga.dataValues.tarimasAmmount);
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Cajas sueltas:", { continued: true })
      .font("Helvetica")
      .text(`${detailShovel.boxesAmmount}`);
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Peso de la Carga:", { continued: true })
      .font("Helvetica")
      .text(`${detailShovel.totalWeight}`);

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
    
    //Cabecilla
    doc.rect(70, 450, 480, 20).fill("#FC427B").stroke("#FC427B");
    doc.fillColor("#fff").text("ID", 80, 456, { width: 80 });
    doc.text("Producto", 140, 456, { width: 100 });
    doc.text("Descripcion", 250, 456, { width: 100});
    doc.text("tipo", 390, 456, { width: 100 });
    doc.text("Qty", 490, 456, { width: 100 });


    //RENDER TABLA PRINCIPAL
    let TOTAL_AMMOUNT = 0
    let arrayProducts = cutArrayProducts(dataTable)

    let productNo = 1;
    let lastPagePrimary = !(dataTable.length > 7 && arrayProducts[1]?.length)
    for (let i = 0; i < arrayProducts[0].length; i++) {
      let ele = arrayProducts[0][i]
      
      let y = 456 + (productNo * 30);
      doc.fillColor("#000").text(ele.id, 75, y, { width: 90 });
      doc.text(String(ele.name+ele.name).sliceName(), 140, y, { width: 190 });
      doc.text(`${ele.colorPrimario}`.sliceDescription(), 250, y, { width: 200, lineBreak: false });
      doc.text(String(ele.tipo).sliceTipo(), 390, y, { width: 100 });
      doc.text(ele.ammount_total, 490, y, { width: 100 });
      TOTAL_AMMOUNT += Number(ele.ammount_total)
      productNo++;

      if(lastPagePrimary && i === arrayProducts[0].length-1 && arrayProducts[0].length <= 7){
        doc.rect(70, y + 20, 480, 0.2).fill("#000000").stroke("#000000");

        doc.font(fontBold).text("Total:", 390, y + 25);
        doc.font(fontBold).text(TOTAL_AMMOUNT, 470, y + 25);
      }else if(lastPagePrimary && i === arrayProducts[0].length-1){
        doc.addPage()
        doc.rect(70, 70, 480, 0.2).fill("#000000").stroke("#000000");
        doc.font(fontBold).text("Total:", 390, 75);
        doc.font(fontBold).text(TOTAL_AMMOUNT, 470, 75);
      }
    }


    //RENDER TABLA RESTANTE
    console.log("Cantidad de paginas");
    console.log(arrayProducts.length);
    if(dataTable.length > 7 && arrayProducts[1]?.length){
      
      for (let i = 1; i < arrayProducts.length; i++) {
        let lastPage = false
        if(i == arrayProducts.length-1){
          lastPage = true
        }

        doc.addPage();
        doc.rect(70, 70, 480, 20).fill("#FC427B").stroke("#FC427B");
        doc.fillColor("#ffffff").text("ID", 80, 75, { width: 80 });
        doc.text("Producto", 140, 75, { width: 100 });
        doc.text("Descripcion", 250, 75, { width: 100 });
        doc.text("tipo", 390, 75, { width: 100 });
        doc.text("Qty", 490, 75, { width: 100 });
    
        //RENDER TABLA Restante
        let productNo = 1;
        for (let j = 0; j < arrayProducts[i].length; j++) {
          let ele = arrayProducts[i][j]

          let y = 80 + (productNo * 30);
          doc.fillColor("#000").text(ele.id, 75, y, { width: 90 });
          doc.text(String(ele.name+ele.name).sliceName(), 140, y, { width: 190 });
          doc.text(`${ele.colorPrimario}`.sliceDescription(), 250, y, { width: 200, lineBreak: false });
          doc.text(String(ele.tipo).sliceTipo(), 390, y, { width: 100 });
          doc.text(ele.ammount_total, 490, y, { width: 100 });
          TOTAL_AMMOUNT += Number(ele.ammount_total)
          productNo++;

          if(lastPage && j === arrayProducts[i].length-1 && arrayProducts[i].length <= 19){
            console.log("ENTRA A LASTPAGE  menor 17");
            doc.rect(70, y + 20, 480, 0.2).fill("#000000").stroke("#000000");

            doc.font(fontBold).text("Total:", 390, y + 25);
            doc.font(fontBold).text(TOTAL_AMMOUNT, 470, y + 25);
          }else if(lastPage && j === arrayProducts[i].length-1 ){
            console.log("ENTRA A LASTPAGE");
            doc.addPage()
            doc.rect(70, 70, 480, 0.2).fill("#000000").stroke("#000000");

            doc.font(fontBold).text("Total:", 390, 75);
            doc.font(fontBold).text(TOTAL_AMMOUNT, 470, 75);
          }
        }
      }
    }


    // Generar el archivo PDF en memoria
    const buffers = [];
    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => {
      // Combinar los fragmentos del buffer en un solo buffer
      const pdfBuffer = Buffer.concat(buffers);

      // Guardar el archivo PDF en el sistema de archivos
      const filePath = path.join(__dirname, "./pdf_momentaneo.pdf");
      fs.writeFileSync(filePath, pdfBuffer);

      // Enviar el archivo PDF como respuesta
      res.contentType("application/pdf");
      res.send(fs.readFileSync(filePath));
    });

    doc.end();
 
    } catch (error) {
        throw new Error(error.message)
    }
}


module.exports = pdfShovelCharge
