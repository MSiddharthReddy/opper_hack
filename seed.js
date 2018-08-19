const faker = require('faker');
const univ = require('./universities');
const univs = univ.map(it => ({ name: it.name, type: 'COLLEGE', websites: it.web_pages }));
const doMongo = require('./mongo');

const randomElem = arr => arr[~~(Math.random() * arr.length)];


// Generates users
// doMongo(async(db) => {
//   for (let i = 0; i < 177; i ++) {
//     await db.collection('users').insertOne({
//       firstName: faker.name.firstName(),
//       lastName: faker.name.lastName(),
//       email: faker.internet.email(),
//       address: faker.address.streetAddress(),
//       schoolState: 'COLLEGE',
//       schoolName: randomElem(univs).name,
//       desiredSchoolNames: [randomElem(univs).name, randomElem(univs).name],
//     });
//   }
// });

// Generates user events
// doMongo(async(db) => {
//   const [events, users] = await Promise.all([
//     db.collection('schoolEvents').find({}).toArray(),
//     db.collection('users').find({}).toArray(),
//   ]);

//   const userEvents = users.filter(it => it.email && Math.random() > 0.5).map(it => ({
//     eventName: randomElem(events).name,
//     userEmail: it.email,
//     state: 'TODO',
//   }));

//   // console.log(userEvents);
//   db.collection('userEvents').insertMany(userEvents);
// });



// Generates many events
// const events = univs.map(it => {
//   return {
//     link: faker.internet.url(),
//     name: faker.lorem.sentence(),
//     description: faker.lorem.paragraph(),
//     deadline: faker.date.future(),
//     schoolName: it.name,
//   };
// });

// doMongo(async(db) => {
//   await db.collection('schoolEvents').insertMany(events);
// });

// Generates many universities
// doMongo(async(db) => {
//   await db.collection('schools').insertMany(univs);
// });

