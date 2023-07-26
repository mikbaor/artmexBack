const nodemailer = require('nodemailer');
const fs = require("fs");
const htmlReceipt = require('./html/receiptSale');
const user = "temgojob@gmail.com"
const password = "obwpzylqkxpmitbt"
const hostEmail = "imap.titan.email"
const port = 465

function emailTicketSale({ detailUser, filePath, namePath, res, email }) {
    console.log("*********** DETAIL *********************");
    console.log(detailUser.client_email);
    console.log("********************************");
    console.log("*********** EMAIL *********************");
    console.log(email);
    console.log("********************************");
    try {
        const transporter = nodemailer.createTransport({
            //host: hostEmail,
            //port: 465,
            //secure: true,
            service: 'gmail',
            auth: {
                user: user,
                pass: password,
            },
            tls: {
                rejectUnauthorized: false,
              }            
        });


        const mailOptions = {
            from: user,
            to: email,//detailUser.client_email,
            subject: 'detailUser.client_email',
            html: htmlReceipt({ name: detailUser.client_name }),
            attachments: [
                {
                    filename: namePath,
                    content: fs.createReadStream(filePath)
                },
            ],
        }
        // Enviar el correo
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                fs.unlink(filePath)
                console.error(error);
            } else {
                fs.unlink(filePath)
                console.log("mensaje enviado correctamente");
            }

        })
        res.status(200).json({
            message: "mensaje enviado",
        })
    } catch (error) {
        res.status(400).json({
            message: "error",
            errorDetails: error.message
        })
    }

}

module.exports = emailTicketSale