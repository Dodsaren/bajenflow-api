const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const twitter = require('./feeds/twitter.js');
const svenskafans = require('./feeds/svenskafans.js');
const facebook = require('./feeds/facebook.js');
const hammarbyfotboll = require('./feeds/hammarbyfotboll.js');

app.use(cors());

app.get('/', (req, res) => res.send('<div>Hello World!</div>'))

app.get('/feed', (req, res) => feed(req, res));

app.get('/svenskafans/feed', (req, res) => svenskafans()
  .then(feed => res.json(feed))
  .catch(err => console.log(err)));

app.get('/twitter/feed', (req, res) => twitter()
  .then(feed => res.json(feed))
  .catch(err => console.log(err)));

app.get('/facebook/feed', (req, res) => facebook()
  .then(feed => res.json(feed))
  .catch(err => console.log({err})));

app.get('/hammarbyfotboll/feed', (req, res) => hammarbyfotboll()
  .then(feed => res.json(feed))
  .catch(err => console.log(err)));

app.listen(process.env.PORT || 8080, () => 
  console.log('Example app listening on port ' + process.env.PORT || 8080))

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