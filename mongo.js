const MongoClient = require('mongodb').MongoClient;
const config = require('./config.json');


// Connection URL
const url = config.mongoURL;

console.log(url)


// Database Name
const dbName = 'opeertunity_hack';

// Use connect method to connect to the server


module.exports = (callback) => {
  MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err) return callback(null, err);
    const db = client.db(dbName);
    callback(db, err);
    client.close();
  });
}
