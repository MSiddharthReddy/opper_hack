const nodemailer = require('nodemailer');
const config = require('./config.json');

async function main() {
    // Generate SMTP service account from ethereal.email

    console.log('Credentials obtained, sending message...');

    // NB! Store the account object values somewhere if you want
    // to re-use the same account for future mail deliveries

    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport(smtpTransport({
    host: 'mail.gmx.com',
    port: 587,
    secure: true,
    auth: {
        user: config.email,
        pass: config.pass
    }
}));

    // Message object
    let message = {
        // Comma separated list of recipients
        to: 'siddharthreddy <siddu1512@gmail.com>',

        // Subject of the message
        subject: 'Nodemailer is unicode friendly ✔',

        // plaintext body
        text: 'Hello to myself!',

        // HTML body
        html:
            '<p><b>Hello</b> to myself <img src="cid:note@example.com"/></p>' +
            '<p>Here\'s a nyan cat for you as an embedded attachment:<br/></p>',
    };

    let info = await transporter.sendMail(message);

    console.log('Message sent successfully!');
    console.log(nodemailer.getTestMessageUrl(info));

    // only needed when using pooled connections
    transporter.close();
}

main().catch(err => {
    console.log('Error', err.message);
    process.exit(1);
});
