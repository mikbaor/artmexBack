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

    let fontBold = "Helvetica-Bold";

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
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Cajas en tarimas:", { continued: true })
      .font("Helvetica")
      .text(`${dataTable[0].countBoxes - detailShovel.boxesAmmount}`);
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Cajas sueltas:", { continued: true })
      .font("Helvetica")
      .text(`${detailShovel.boxesAmmount}`);
    doc

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Peso bruto total:", { continued: true })
      .font("Helvetica")
      .text(`${detailShovel.totalWeight}`);
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Unidad de Peso:", { continued: true })
      .font("Helvetica")
      .text("KGM");
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Material o residuo peligroso:", { continued: true })
      .font("Helvetica")
      .text("NO");


    const WIDTH_INICIO = 70
    const WIDTH_FIN = 480

    const PAGE_WIDTH_FULL = doc.page.width;
    const inicioYRestantPage = 70
    const alturaCajaObeservaciones = 150
    //datos para la firma
    const text1 = "RECIBO DE CONFORMIDAD"
    const text2 = "(Nombre y firma del destinatario o persona autorizada)"

    //Cabecilla
    const cabecillaY = 486
    doc.rect(WIDTH_INICIO, cabecillaY-6, WIDTH_FIN, 20).fill("#FC427B").stroke("#FC427B");
    doc.fillColor("#ffffff").text("ID", 80, cabecillaY, { width: 80 });
    doc.text("Producto", 140, cabecillaY, { width: 100 });
    doc.text("Descripcion", 250, cabecillaY, { width: 100});
    doc.text("tipo", 390, cabecillaY, { width: 100 });
    doc.text("Qty", 485, cabecillaY, { width: 100 });


    //RENDER TABLA PRINCIPAL
    let TOTAL_AMMOUNT = 0
    let arrayProducts = cutArrayProducts(dataTable)

    let productNo = 1;
    let lastPagePrimary = !(dataTable.length > 6 && arrayProducts[1]?.length)
    for (let i = 0; i < arrayProducts[0].length; i++) {
      let ele = arrayProducts[0][i]
      
      let y = cabecillaY + (productNo * 30);
      doc.fillColor("#000").text(ele.id, 75, y, { width: 90 });
      doc.text(String(ele.name+ele.name).sliceName(), 140, y, { width: 190 });
      doc.text(`${ele.colorPrimario}`.sliceDescription(), 250, y, { width: 200, lineBreak: false });
      doc.text(String(ele.tipo).sliceTipo(), 390, y, { width: 100 });
      doc.text(ele.ammount_total, 485, y, { width: 100 });
      TOTAL_AMMOUNT += Number(ele.ammount_total)
      productNo++;

      if(lastPagePrimary && i === arrayProducts[0].length-1 && arrayProducts[0].length <= 6){
        doc.rect(70, y + 20, 480, 0.4).fill("#000000").stroke("#000000");
        //total
        doc.font(fontBold).text("Total:", 390, y + 25);
        doc.font(fontBold).text(TOTAL_AMMOUNT, 485, y + 25);

        doc.addPage()
        let separacionResultado = 0
        doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .text("Observaciones",  70, inicioYRestantPage + separacionResultado);
        
        doc.rect(WIDTH_INICIO, inicioYRestantPage + separacionResultado + 20, WIDTH_FIN, 0.4).fill("#000000").stroke("#000000");
        doc.rect(WIDTH_INICIO, inicioYRestantPage + separacionResultado + 20 + alturaCajaObeservaciones, WIDTH_FIN, 0.4).fill("#000000").stroke("#000000");
        doc.rect(WIDTH_INICIO, inicioYRestantPage + separacionResultado + 20 , 0.4, alturaCajaObeservaciones).fill("#000000").stroke("#000000");
        doc.rect(WIDTH_FIN + WIDTH_INICIO, inicioYRestantPage + separacionResultado +20, 0.4, alturaCajaObeservaciones).fill("#000000").stroke("#000000");

        //responsable
        doc.rect(WIDTH_INICIO, inicioYRestantPage + alturaCajaObeservaciones + separacionResultado + 160, WIDTH_FIN, 0.8).fill("#000000").stroke("#000000");

        const textoWidth1 = doc.widthOfString(text1);
        const textoWidth2 = doc.widthOfString(text2); // Ancho del texto              // Ancho del texto
        const posicionX1 = (PAGE_WIDTH_FULL - textoWidth1) / 2;
        const posicionX2 = (PAGE_WIDTH_FULL - textoWidth2) / 2;

        doc.font("Helvetica-Bold")
        .fontSize(14)
        .text(text1, posicionX1, inicioYRestantPage + alturaCajaObeservaciones + separacionResultado + 170);
        doc.font("Helvetica-Bold")
        .fontSize(14)
        .text(text2, posicionX2, inicioYRestantPage + alturaCajaObeservaciones + separacionResultado + 185);
      
      }
    }


    //RENDER TABLA RESTANTE
    if(dataTable.length > 6 && arrayProducts[1]?.length){
      
      for (let i = 1; i < arrayProducts.length; i++) {
        let lastPage = false
        if(i == arrayProducts.length-1){
          lastPage = true
        }

        //CABECILLA
        doc.addPage();
        doc.rect(WIDTH_INICIO, inicioYRestantPage, WIDTH_FIN, 20).fill("#FC427B").stroke("#FC427B");
        doc.fillColor("#ffffff").text("ID", 80, inicioYRestantPage + 5, { width: 80 });
        doc.text("Producto", 140, inicioYRestantPage + 5, { width: 100 });
        doc.text("Descripcion", 250, inicioYRestantPage + 5, { width: 100 });
        doc.text("tipo", 390, inicioYRestantPage + 5, { width: 100 });
        doc.text("Qty", 485, inicioYRestantPage + 5, { width: 100 });
    
        //RENDER TABLA Restante
        let productNo = 1;
        for (let j = 0; j < arrayProducts[i].length; j++) {
          let ele = arrayProducts[i][j]

          let y = 80 + (productNo * 30);
          doc.fillColor("#000").text(ele.id, 75, y, { width: 90 });
          doc.text(String(ele.name+ele.name).sliceName(), 140, y, { width: 190 });
          doc.text(`${ele.colorPrimario}`.sliceDescription(), 250, y, { width: 200, lineBreak: false });
          doc.text(String(ele.tipo).sliceTipo(), 390, y, { width: 100});
          doc.text(ele.ammount_total, 485, y, { width: 100 });
          TOTAL_AMMOUNT += Number(ele.ammount_total)
          productNo++;

          if(lastPage && j === arrayProducts[i].length-1 && arrayProducts[i].length <= 19){
            console.log("ENTRA A LASTPAGE  menor 17");
            doc.rect(WIDTH_INICIO, y + 20, WIDTH_FIN, 0.4).fill("#000000").stroke("#000000");

            //TOTAL
            doc.font(fontBold).text("Total:", 390, y + 25);
            doc.font(fontBold).text(TOTAL_AMMOUNT, 485, y + 25);

            //observaciones
            if(arrayProducts[i].length <= 6){
              let separacionResultado = 70
              doc
              .font("Helvetica-Bold")
              .fontSize(14)
              .text("Observaciones",  70, y + separacionResultado);
              
              doc.rect(WIDTH_INICIO, y + separacionResultado + 20, WIDTH_FIN, 0.4).fill("#000000").stroke("#000000");
              doc.rect(WIDTH_INICIO, y + separacionResultado + 20 + alturaCajaObeservaciones, WIDTH_FIN, 0.4).fill("#000000").stroke("#000000");
              doc.rect(WIDTH_INICIO, y + separacionResultado + 20 , 0.4, alturaCajaObeservaciones).fill("#000000").stroke("#000000");
              doc.rect(WIDTH_FIN + WIDTH_INICIO, y + separacionResultado +20, 0.4, alturaCajaObeservaciones).fill("#000000").stroke("#000000");

              //responsable
              doc.rect(WIDTH_INICIO, y + alturaCajaObeservaciones + separacionResultado + 160, WIDTH_FIN, 0.8).fill("#000000").stroke("#000000");

              const textoWidth1 = doc.widthOfString(text1);
              const textoWidth2 = doc.widthOfString(text2); // Ancho del texto              // Ancho del texto
              const posicionX1 = (PAGE_WIDTH_FULL - textoWidth1) / 2;
              const posicionX2 = (PAGE_WIDTH_FULL - textoWidth2) / 2;

              doc.font("Helvetica-Bold")
              .fontSize(14)
              .text(text1, posicionX1, y + alturaCajaObeservaciones + separacionResultado + 170);
              doc.font("Helvetica-Bold")
              .fontSize(14)
              .text(text2, posicionX2, y + alturaCajaObeservaciones + separacionResultado + 185);
            }else{    
              doc.addPage()
              let separacionResultado = 0
              doc
              .font("Helvetica-Bold")
              .fontSize(14)
              .text("Observaciones",  70, inicioYRestantPage + separacionResultado);
              
              doc.rect(WIDTH_INICIO, inicioYRestantPage + separacionResultado + 20, WIDTH_FIN, 0.4).fill("#000000").stroke("#000000");
              doc.rect(WIDTH_INICIO, inicioYRestantPage + separacionResultado + 20 + alturaCajaObeservaciones, WIDTH_FIN, 0.4).fill("#000000").stroke("#000000");
              doc.rect(WIDTH_INICIO, inicioYRestantPage + separacionResultado + 20 , 0.4, alturaCajaObeservaciones).fill("#000000").stroke("#000000");
              doc.rect(WIDTH_FIN + WIDTH_INICIO, inicioYRestantPage + separacionResultado +20, 0.4, alturaCajaObeservaciones).fill("#000000").stroke("#000000");

              //responsable
              doc.rect(WIDTH_INICIO, inicioYRestantPage + alturaCajaObeservaciones + separacionResultado + 160, WIDTH_FIN, 0.8).fill("#000000").stroke("#000000");

              const textoWidth1 = doc.widthOfString(text1);
              const textoWidth2 = doc.widthOfString(text2); // Ancho del texto              // Ancho del texto
              const posicionX1 = (PAGE_WIDTH_FULL - textoWidth1) / 2;
              const posicionX2 = (PAGE_WIDTH_FULL - textoWidth2) / 2;

              doc.font("Helvetica-Bold")
              .fontSize(14)
              .text(text1, posicionX1, inicioYRestantPage + alturaCajaObeservaciones + separacionResultado + 170);
              doc.font("Helvetica-Bold")
              .fontSize(14)
              .text(text2, posicionX2, inicioYRestantPage + alturaCajaObeservaciones + separacionResultado + 185);
            }

          }else if(lastPage && j === arrayProducts[i].length-1 ){
            console.log("ENTRA A LASTPAGE");
            doc.addPage()
            doc.rect(WIDTH_INICIO, inicioYRestantPage, WIDTH_FIN, 0.4).fill("#000000").stroke("#000000");

            //TOTAL
            doc.font(fontBold).text("Total:", 390, inicioYRestantPage + 5);
            doc.font(fontBold).text(TOTAL_AMMOUNT, 485, inicioYRestantPage + 5);

    
            //caja para observaciones
            let separacionResultado = 70
            doc
            .font("Helvetica-Bold")
            .fontSize(14)
            .text("Observaciones",  70, inicioYRestantPage + separacionResultado);
            
            doc.rect(WIDTH_INICIO, inicioYRestantPage + separacionResultado + 20, WIDTH_FIN, 0.4).fill("#000000").stroke("#000000");
            doc.rect(WIDTH_INICIO, inicioYRestantPage + separacionResultado + 20 + alturaCajaObeservaciones, WIDTH_FIN, 0.4).fill("#000000").stroke("#000000");
            doc.rect(WIDTH_INICIO, inicioYRestantPage + separacionResultado + 20 , 0.4, alturaCajaObeservaciones).fill("#000000").stroke("#000000");
            doc.rect(WIDTH_FIN + WIDTH_INICIO, inicioYRestantPage + separacionResultado +20, 0.4, alturaCajaObeservaciones).fill("#000000").stroke("#000000");

            //responsable
            doc.rect(WIDTH_INICIO, inicioYRestantPage + alturaCajaObeservaciones + separacionResultado + 160, WIDTH_FIN, 0.8).fill("#000000").stroke("#000000");

            const textoWidth1 = doc.widthOfString(text1);
            const textoWidth2 = doc.widthOfString(text2);
            const posicionX1 = (PAGE_WIDTH_FULL - textoWidth1) / 2;
            const posicionX2 = (PAGE_WIDTH_FULL - textoWidth2) / 2;

            doc.font("Helvetica-Bold")
            .fontSize(14)
            .text(text1, posicionX1, inicioYRestantPage + alturaCajaObeservaciones + separacionResultado + 170);
            doc.font("Helvetica-Bold")
            .fontSize(14)
            .text(text2, posicionX2, inicioYRestantPage + alturaCajaObeservaciones + separacionResultado + 185);

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
