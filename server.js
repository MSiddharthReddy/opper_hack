const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');
const MongoClient = require('mongodb').MongoClient;

const app = express();

// Connection URL
const url = 'mongodb://hacker:iloveicecream1@ds125912.mlab.com:25912/opeertunity_hack';

// Database Name
const dbName = 'myproject';

// Use connect method to connect to the server
MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {

  const db = client.db(dbName);

  client.close();
});

app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));

app.listen(4000, () => {
  console.log('Listening to port 4000!')
})
