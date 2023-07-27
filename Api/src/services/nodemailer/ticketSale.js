const nodemailer = require('nodemailer');
const fs = require("fs");
const htmlReceipt = require('./html/receiptSale');
require("dotenv").config();


const user = "temgojob@gmail.com"
const password = "obwpzylqkxpmitbt"
const hostEmail = "imap.titan.email"
const port = 465

const { USER_EMAIL, PASSWORD_EMAIL, HOST_EMAIL, PORT_SSL_EMAIL } = process.env;



function emailTicketSale({ detailUser, filePath, namePath, res, email }) {
    try {
        const transporter = nodemailer.createTransport({
            //host: HOST_EMAIL,
            service: "gmail",
            //host: 'smtp-mail.outlook.com', // Servidor SMTP de Outlook
            //port: Number(PORT_SSL_EMAIL),
            secure: false,
            // tls: {
            //     ciphers: "SSLv3",
            //     rejectUnauthorized: false,
            // },
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
            subject: 'RECEIPT',
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
                console.log("no se pudo enviar el correo");
                console.log("****** ERROR ******");
                console.error(error);
                console.log("****** ERROR ******");
                console.log("****** INFO ******");
                console.log(info);
                console.log("****** INFO ******");

            } else {
                console.log("correo enviado correctamente");
            }
            try {
                fs.unlinkSync(filePath);
            } catch (error) {
                console.log(error);
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