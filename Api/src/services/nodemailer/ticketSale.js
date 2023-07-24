const nodemailer = require('nodemailer');
const fs = require("fs");
const htmlReceipt = require('./html/receiptSale');
const user = "temgojob@gmail.com"
const password = "obwpzylqkxpmitbt"
const hostEmail = "imap.titan.email"
const port = 465

function emailTicketSale({ detailUser, filePath, namePath, res }) {
    // detailUser.client_name
    // detailUser.client_email
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
        to: "sebastianortiz@techmins.com.mx",//detailUser.client_email,
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
            try {
                fs.unlinkSync(filePath);
                console.log(error)
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                fs.unlinkSync(filePath);
                console.log("Correo enviado exitosamente");
            } catch (error) {
                console.error(error);
            }

        }
    });
    res.status(200).json({
        message: "mail sent successfully",
    });
}

module.exports = emailTicketSale