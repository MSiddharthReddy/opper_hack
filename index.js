const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const crawler = require('./crawler');
const notification = require('./notification');

setInterval(crawler, 36000000);
setInterval(notification, 36000000);

schema = fs.readFileSync('./schema/schema.graphql').toString();

const doMongo = require('./mongo.js');

const typeDefs = gql(schema);

const RESOURCES = 'resources';
const USERS = 'users';
const SCHOOLS = 'schools';
const SCHOOL_EVENTS = 'schoolEvents';
const RESOURCE_TAGS = 'resourceTags';
const USER_EVENTS = 'userEvents';

const filterUndefined = (obj) => Object.keys(obj).reduce((acc, n) => {
  if (obj[n] !== undefined) acc[n] = obj[n];
  return acc;
}, {});

const resolvers = {
  Query: {
    users: async(obj, args) => doMongo(async(db) => {
      let users = await db.collection(USERS).find(filterUndefined({ email: args.email }));
      if (args.skip || args.skip === 0) users = users.skip(args.skip);
      if (args.limit || args.limit === 0) users = users.limit(args.limit);
      users = await users.toArray();
      if (!args.desiredSchoolNames) return users;
      return users.filter(it => it.desiredSchoolNames && it.desiredSchoolNames.includes(args.desiredSchoolName));
    }),

    schools: async(obj, args) => doMongo(async(db) => {
      let schools = db.collection(SCHOOLS).find(filterUndefined({ name: args.name, type: args.schoolType }));
      if (args.skip || args.skip === 0) schools = schools.skip(args.skip);
      if (args.limit || args.limit === 0) schools = schools.limit(args.limit);
      return schools.toArray();
    }),

    resources: async(query, args) => doMongo(async(db) => {
      let resources = db.collection(RESOURCES).find({});
      if (args.skip || args.skip === 0) resources = resources.skip(args.skip);
      if (args.limit || args.limit === 0) resources = resources.limit(args.limit);
      return resources.toArray();
    }),
  },

  Mutation: {
    addResources: async(obj, args) => doMongo(async(db) =>
      db.collection(RESOURCES).insertMany(args.names.reduce((acc, name, index) =>
      acc.concat({ name, link: args.links[index] }), []))),

    addUser:async(obj, args) =>
      doMongo(async(db, err) => db.collection(USERS).insertOne(args)),

    addSchool: async(obj, args) => doMongo(async(db) =>
      db.collection(SCHOOLS).updateOne({ name: args.name }, { $set: args }, { upsert: true })),

    addUserDesiredSchool: async(obj, args, context) => doMongo(async (db) => {
      const collection = db.collection(USERS);
      let user = await collection.find({email: args.userEmail}).toArray() || [];

      user.desiredSchoolNames = user.desiredSchoolNames || [];
      user.desiredSchoolNames.push(args.schoolName);
      await collection.updateOne({ email: args.userEmail }, { $set: { desiredSchoolNames: user.desiredSchoolNames } }, { upsert: true});
      return {};
    }),

    addSchoolEvent: async(obj, args, context) => doMongo(async(db) =>
      db.collection(SCHOOL_EVENTS).updateOne(
        { name: args.name, schoolName: args.schoolName },
        { $set: args },
        { upsert: true },
      )),

    addResourceTag: async(obj, args) => doMongo(async(db) =>
      db.collection(RESOURCE_TAGS).updateOne({ name: args.name }, { $set: args }, { upsert: true })),

    updateUserEvent: async(mutation, args) => doMongo(async(db) =>
      db.collection(USER_EVENTS).updateOne({ eventName: args.eventName, userEmail: args.userEmail }, {
        $set: { state: args.state },
      }, { upsert: false })),

    createEvent: async(mutation, args) => doMongo(async(db) => db.collection(SCHOOL_EVENTS).insertOne(args)),

    associateEventWithUser: async(mutation, args) => doMongo(async(db) =>
      db.collection.updateOne(args, { $set: args}, { upsert: true })),
  },

  School: {
    events: async(school) => doMongo(async(db) =>
      db.collection(SCHOOL_EVENTS).find({ schoolName: school.name }).toArray()),

    students: async(school) => doMongo(async(db) =>
      db.collection(USERS).find({ schoolName: school.name }).toArray()),
  },

  User: {
    school: async(user) => doMongo(async(db) => db.collection(SCHOOLS).findOne({ name: user.schoolName })),

    checklist: async(user) => doMongo(async(db) => {
      if (!user.email) return [];
      return db.collection(USER_EVENTS).find({ userEmail: user.email }).toArray()
    }),

    desiredSchoolNames: user => user.desiredSchoolNames || [],

    desiredSchools: async(user) => doMongo(async(db) => {
      const schools = await db.collection(SCHOOLS).find({ }).toArray();
      
      // TODO optimize
      return schools.filter(it => (user.desiredSchoolNames || []).includes(it.name));
    }),
  },

  Resource: {
    school: async(resource) => doMongo(async(db) =>
      db.collection(SCHOOLS).findOne({ name: resource.schoolName })),
  },

  UserEvent: {
    user: async(userEvent) => doMongo(async(db) =>
      db.collection(USERS).findOne({ email: userEvent.userEmail })),

    event: async(userEvent) => doMongo(async(db) =>
      db.collection(SCHOOL_EVENTS).findOne({ name: userEvent.eventName })),
  },
};

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = new ApolloServer({ typeDefs, resolvers, introspection: true });
server.applyMiddleware({ app });

app.post('/registration-form', (req, res) => {
  console.log(req.body);

  res.status(200).end();
});

const port = process.env.PORT || 4000;
app.listen({ port }, () => {
  console.log(`🚀  Server ready at ${port}, graphql path: ${server.graphqlPath}`);
});
