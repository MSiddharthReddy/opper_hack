const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://hacker:iloveicecream1@ds125912.mlab.com:25912/opeertunity_hack';

// Database Name
const dbName = 'myproject';

// Use connect method to connect to the server


module.exports = (callback) => {
  MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err) return callback(null, err);
    const db = client.db(dbName);
    callback(db, err);
    client.close();
  });
}