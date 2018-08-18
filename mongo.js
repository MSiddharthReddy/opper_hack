const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://hacker:iloveicecream1@ds125912.mlab.com:25912/opeertunity_hack';

// Database Name
const dbName = 'opeertunity_hack';

// Use connect method to connect to the server


module.exports = async(callback) => new Promise((resolve, reject) => {
  MongoClient.connect(url, { useNewUrlParser: true }, async(err, client) => {
    if (err) return reject(err);
    const db = client.db(dbName);
    const result = await callback(db, err);
    client.close();
    return resolve(result);
  });
});
