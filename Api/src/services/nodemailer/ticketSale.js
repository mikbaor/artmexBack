const nodemailer = require('nodemailer');

const user = "fraynilson@techminds.com.mx"
const password = "admin-1234"
const hostEmail = "imap.titan.email"

function emailTicketSale() {


    const transporter = nodemailer.createTransport({
        host: hostEmail,
        port: 465,
        secure: true,
        auth: {
            user: user,
            pass: password,
        },
    });

    const mailOptions = {
        from: user, // La dirección de correo electrónico
        to: 'fraytoledotapia2003@gmail.com', // La dirección de correo electrónico del destinatario
        subject: 'Prueba de envío correo', // El asunto del correo
        text: 'Este es un correo de prueba desde fraynilson@techminds.com.mx', // El contenido del correo (texto plano)
    };

    // Enviar el correo
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error al enviar el correo:', error);
        } else {
            console.log('Correo enviado:', info.response);
        }
    });

}

module.exports = emailTicketSale