const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
schema = fs.readFileSync('./schema/schema.graphql').toString();

// Connection URL
const url = 'mongodb://hacker:iloveicecream1@ds125912.mlab.com:25912/opeertunity_hack';

// Database Name
const dbName = 'myproject';

// Use connect method to connect to the server
MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {

  const db = client.db(dbName);

  client.close();
});



// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql(schema);

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
  },
  Mutation: {
  },
};

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({app});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
app.listen({ port: 4000 }, () => {
  console.log(`🚀  Server ready at 4000`);
});