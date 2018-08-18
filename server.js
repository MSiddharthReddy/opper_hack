const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const fs = require('fs');
schema = fs.readFileSync('./schema/schema.graphql').toString();

const doMongo = require('./mongo.js');

const typeDefs = gql(schema);


const RESOURCES = 'resources';
const USERS = 'users';
const SCHOOLS = 'schools';
const SCHOOL_EVENTS = 'schoolEvents';

const filterUndefined = (obj) => Object.keys(obj).reduce((acc, n) => {
  if (obj[n] !== undefined) acc[n] = obj[n];
  return acc;
}, {});

const resolvers = {
  Query: {
    users: async(obj, args, context) => doMongo(async(db) => new Promise((res, rej) => {
        db.collection(USERS).find({}).toArray((err, docs) => {
          if (err) console.error(err);
          else console.log(docs);
          return res(docs);
        });
      })),

    schools: async(obj, args, context) => doMongo(async(db) => new Promise((res, rej) => {
      db.collection(SCHOOLS).find(filterUndefined({ name: args.name, type: args.schoolType })).toArray((err, docs) => {
        if (err) console.error(err);
        else console.log(docs);
        return res(docs);
      });
    })),

    resources: async() => doMongo(async(db) => new Promise((res, rej) => {
      db.collection(RESOURCES).find({}).toArray((err, docs) => {
        if (err) console.error(err);
        else console.log(docs);
        return res(docs);
      });
    })),
  },

  Mutation: {
    addResources: async(obj, args, context) => {
      const result = args.names.reduce((acc, name, index) =>
        acc.concat({ name, link: args.links[index]}),
      []);

      return doMongo(async(db) => new Promise((res, rej) => {
        db.collection(RESOURCES).insertMany(result, (err, result) => {
          if (err !== null) console.error(err);
          else console.log(result);
          return res(result);
        });
      }));
    },

    addSchool: async(obj, args, context) => doMongo(async(db) => new Promise((res, rej) => {
      db.collection(SCHOOLS).updateOne({ name: args.name }, { $set: args }, { upsert: true}, (err, result) => {
        if (err) console.error(err);
        else console.log(result);
        return res({});
      });
    })),

    addSchoolEvent: async(obj, args, context) => doMongo(async(db) => new Promise((res, rej) => {
      db.collection(SCHOOL_EVENTS).updateOne({ name: args.name, schoolName: args.schoolName },
        { $set: args }, { upsert: true }, (err, result) => {
        if (err) console.error(error);
        else console.log(result);
        return res({});
      });
    })),
  },

  School: {
    events: async(school) => doMongo(async(db) => new Promise((res, rej) => {
      db.collection(SCHOOL_EVENTS).find({ schoolName: school.name }).toArray((err, docs) => {
        if (err) console.error(err);
        else console.log(docs);
        return res(docs);
      });
    })),

    students: async(school) => doMongo(async(db) => new Promise((res, rej) => {
      db.collection(USERS).find({ schoolName: school.name }).toArray((err, docs) => {
        if (err) console.error(err);
        else console.log(docs);
        return res(docs);
      });
    }))
  },

  User: {
    school: async(user) => doMongo(async(db) => new Promise((res, rej) => {
      db.collection(SCHOOLS).find({ name: user.schoolName }).toArray((err, docs) => {
        if (err) console.error(err);
        else console.log(docs);
        return res(docs);
      });
    }))
  },

  Resource: {
    school: async(resource) => doMongo(async(db) => new Promise((res, rej) => {
      db.collection(SCHOOLS).find({ name: resource.schoolName }).toArray((err, docs) => {
        if (err) console.error(err);
        else console.log(docs);
        return res(docs);
      });
    }))
  }
};

const app = express();

app.post('/registration-form', (req, res) => {
  console.log(req.body);

  res.status(200).end();
});

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({app});

const port = process.env.PORT || 4000;
app.listen({ port, }, () => {
  console.log(`🚀  Server ready at ${port}`);
});
