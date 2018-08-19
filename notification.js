const nodemailer = require('nodemailer');
const config = require('./config.json');
const doMongo = require('./mongo.js');

const USER_EVENTS = "userEvents";
const SCHOOL_EVENTS = "schoolEvents";

const transporter = nodemailer.createTransport({
  service: 'FastMail',
  auth: {
    user: config.email,
    pass: config.pass
  }
});

module.exports = () => {
  doMongo(async(db, err) => {
    const userEvents = await db.collection(USER_EVENTS).find().toArray();
    userEvents.map( event => {
      findEvents(event);
    })
  });
};

const findEvents = event => {
  doMongo(async(db, err) => {
    const events = await db.collection(SCHOOL_EVENTS).find({name: event.eventName }).toArray();
    const today = new Date();
    const timeDiff = Math.abs(today - new Date(events[0].deadline));
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if(diffDays === 1) {
    // setup e-mail data with unicode symbols
    let mailOptions = {
        from: '"Joshua" <Joshua@f-Connect.com>', // sender address
        to: 'siddu1512@gmail.com', // list of receivers
        subject: 'Notification: Deadline approaching soon ✔', // Subject line
        text: `${events.name} is due soon please complete it.`, // plaintext body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
  }

  });
}
