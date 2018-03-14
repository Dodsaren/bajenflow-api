const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const twitter = require('./feeds/twitter.js');
const svenskafans = require('./feeds/svenskafans.js');
const facebook = require('./feeds/facebook.js');
const hammarbyfotboll = require('./feeds/hammarbyfotboll.js');

const feeds = {
  twitter,
  svenskafans,
  facebook,
  hammarbyfotboll
};

app.use(cors());

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))

app.get('/feed', (req, res) => feed(req, res));

//TODO: Try and figure out a way to get rid of this duplicate code.
//https://expressjs.com/en/guide/routing.html#route-parameters
app.get('/:source/feed', (req, res) => 
  typeof feeds[req.params.source] === 'function' 
  ? feeds[req.params.source]()
  .then(feed => res.json(feed))
  .catch(err => res.status(500).send(err))
  : res.status(404).send('Bad Request')
);

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