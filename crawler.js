const scraper = require('google-search-scraper');
const doMongo = require('./mongo.js');

const RESOURCES = 'resources';
const RESOURCE_TAGS = 'resourceTags';

module.exports = () => {
  doMongo(async(db, err) => {
    const resourceTags = await db.collection(RESOURCE_TAGS).find().toArray();
    resourceTags.map( resource => {
      let options = {
        query: resource.name,
        limit: 25,
      }
      search(options);
    })
  });
};

const search = (options) => {
  scraper.search(options, function(err, url, meta) {
    console.log("in the search", options)
    // This is called for each result
    if(err) console.error(err);
    doMongo(async(db, err) => new Promise((res, rej) => {
      db.collection(RESOURCES).updateOne({
        link: url
      },
      {$set: {
        name: meta.title,
        link: url,
        tag: options.query
      }}, {
        upsert: true
      },
       (err, result) => {
        if (err) console.error(err);
        console.log('yaya')
        return res({});
      });
    }))

  });
}
