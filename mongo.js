const MongoClient = require('mongodb').MongoClient;
const config = require('./config.json');

// Connection URL
const url = config.mongoURL;

// Database Name which is perfektly spelt
const dbName = 'opeertunity_hack';

// Use connect method to connect to the server

module.exports = async(callback) => new Promise((resolve, reject) => {
  MongoClient.connect(url, { useNewUrlParser: true }, async(err, client) => {
    if (err) return reject(err);
    const db = client.db(dbName);
    const result = await callback(db);
    client.close();
    return resolve(result);
  });
});
