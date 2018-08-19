const nodemailer = require('nodemailer');
const config = require('./config.json');

var transporter = nodemailer.createTransport({
    host: 'mail.gmx.com',
    port: 465,
    secure: true,
  auth: {
    user: 'person_the@gmx.com',
    pass: 'opportunity_hack2018'
  }
});

var mailOptions = {
  from: 'siddu1512@gmail.com',
  to: 'siddu1512@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
