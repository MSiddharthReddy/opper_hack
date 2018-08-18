const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const fs = require('fs');
schema = fs.readFileSync('./schema/schema.graphql').toString();

const doMongo = require('./mongo.js');

const typeDefs = gql(schema);


const RESOURCES = 'resources';
const USERS = 'users';

const resolvers = {
  Query: {
    users: async(obj, args, context) => doMongo(async(db, err) => new Promise((res, rej) => {

        collection = db.collection(USERS);

        collection.find({}).toArray((err, docs) => {
          if (err) {
            console.error(err);
            return res(null);
          }
          return res(docs);
        });
      })),
  },
  User: {

  },
  Mutation: {
    addResources: async(obj, args, context) => {
      const result = args.names.reduce((acc, name, index) =>
        acc.concat({ name, link: args.urls[index]}), []);

      doMongo((db, err) => {
        if (err !== null) return console.error(err);
        const collection = db.collection(RESOURCES);

        collection.insertMany(result, (err, result) => {
          if (err !== null) return console.error(err);

          console.log(RESOURCES, result);
        });
      });

      return {};
    }
  },
};

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({app});

app.listen({ port: 4000 }, () => {
  console.log(`🚀  Server ready at 4000`);
});