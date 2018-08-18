const scraper = require('google-search-scraper');

const RESOURCES = 'resources';

let options = {
  query: 'Bay Area Foster Youth Services',
  limit: 25
};

let titles = [];
let urls = [];
let counter = 0;

scraper.search(options, function(err, url, meta) {
  // This is called for each result
  if(err) throw err;
  titles.push(meta.title);
  urls.push(url);
  counter = counter + 1;
  if(counter === options.limit) {
    insertToMongo();
  }
});
