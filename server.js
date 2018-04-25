const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('./logger');
const feeds = {
  twitter: require('./feeds/twitter.js'),
  svenskafans: require('./feeds/svenskafans.js'),
  facebook: require('./feeds/facebook.js'),
  hammarbyfotboll: require('./feeds/hammarbyfotboll.js')
};

app.use(cors());

app.use(logger);

app.all('/ping', (req, res) => res.send('pong'));

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))

app.get('/feed', (req, res) => feed(req, res));

app.get('/:source/feed', (req, res) => {
  if (typeof feeds[req.params.source] !== 'function') {
    return res.status(400).send('Bad Request');
  }
  feeds[req.params.source]()
    .then(feed => res.json(feed))
    .catch(err => catcher(err, res))
});

app.listen(process.env.PORT || 8080, () => 
  console.log('Bajen flow app listening on port ' + process.env.PORT || 8080))

const feed = (req, res) => {
  Promise.all([
    feeds.twitter(),
    feeds.svenskafans(),
    feeds.facebook(),
    feeds.hammarbyfotboll()
  ]).then(feed => {
    const result = {
      twitter: feed[0],
      svenskafans: feed[1],
      facebook: feed[2],
      hammarbyfotboll: feed[3]
    };
    res.json(result)
  }).catch(err => catcher(err, res));
}

const catcher = (err, res) => {
  console.log('%s ERROR: %s', new Date().toLocaleString(), err);
  res.status(500).send('Internal Server Error')
}