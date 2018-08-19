const scraper = require('google-search-scraper');
const doMongo = require('./mongo.js');

const RESOURCES = 'resources';



let options = {
  query: 'Foster Resources',
  limit: 25
};

let titles = [];
let urls = [];

scraper.search(options, function(err, url, meta) {
  // This is called for each result
  if(err) throw err;
  doMongo(async(db, err) => new Promise((res, rej) => {
    db.collection(RESOURCES).updateOne({
      link: url
    },
    {$set: {
      name: meta.title,
      link: url
    }}, {
      upsert: true
    },
     (err, result) => {
      if (err) console.error(err);
      else console.log(result);
      return res({});
    });
  }))

});
