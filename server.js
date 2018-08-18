const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const fs = require('fs');
schema = fs.readFileSync('./schema/schema.graphql').toString();

const doMongo = require('./mongo.js');

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql(schema);

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    users: async(obj, args, context) => {
      // doMongo()
    },
  },
  User: {

  },
  Mutation: {
    addResources: async(obj, args, context) => {
      const result = args.names.reduce
    }
  },
};

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({app});

app.listen({ port: 4000 }, () => {
  console.log(`🚀  Server ready at 4000`);
});