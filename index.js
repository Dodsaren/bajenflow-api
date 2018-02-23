const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const twitter = require('./feeds/twitter.js');
const svenskafans = require('./feeds/svenskafans.js');
const facebook = require('./feeds/facebook.js');
const hammarbyfotboll = require('./feeds/hammarbyfotboll.js');

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/feed', (req, res) => feed(req, res));

app.get('/svenskafans/feed', (req, res) => svenskafans()
  .then(feed => res.json(feed))
  .catch(err => res.send(err)));

app.get('/twitter/feed', (req, res) => twitter()
  .then(feed => res.json(feed))
  .catch(err => res.send(err)));

app.get('/facebook/feed', (req, res) => facebook()
  .then(feed => res.json(feed))
  .catch(err => res.send(err)));

app.get('/hammarbyfotboll/feed', (req, res) => hammarbyfotboll()
  .then(feed => res.json(feed))
  .catch(err => res.send(err)));

app.listen(3000, () => console.log('Example app listening on port 3000!'))

const feed = (req, res) => {
  const sources = [
    twitter(),
    svenskafans(),
    facebook(),
    hammarbyfotboll()
  ];

  Promise.all(sources).then(feed => {
    const result = {
      twitter: feed[0],
      svenskafans: feed[1],
      facebook: feed[2],
      hammarbyfotboll: feed[3]
    };
    res.json(result)
  }).catch(err => res.send(err));
}

// const schema = {
//   offers: [
//     '.offer-category__item',
//     {
//       name: '.offer-type__product-name',
//       price: '.product-price__price-value',
//       amount: ($, context) => $('.product-price__unit-item', context).text().replace('/', '') || $('.product-price__amount', context).text().replace(' för', ''),
//       info: '.offer-type__product-info',
//       image: $ => $('.lazy').attr('data-original'),
//     }
//   ]
// }
// Scraper.get('https://www.ica.se/butiker/supermarket/stockholm/ica-supermarket-matmaster-1272/erbjudanden/', schema)
//   .then(page => {
//     console.log(JSON.stringify(page, null, 2))
//   })
