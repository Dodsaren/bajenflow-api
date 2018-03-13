const rp = require('request-promise');
const rawurlencode = require('../utils/rawurlencode.js');
const normalize = require('../utils/normalize.js');
const NodeCache = require('node-cache');
const myCache = new NodeCache();
const cacheKey = 'twitter';

const CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;

const API_BASE_PATH = 'https://api.twitter.com';

const SCREEN_NAMES = [
  'Walterbergman',
  'oloflaul',
  'HakanWillner',
  'BjornenJohan',
  'ggranqvist',
  'ultrish',
  'egen_falang',
  'Panikbloggeri1',
  'Ponhak',
  'Fredelb',
  'gronvita',
  'PatrikNiklasson'
];

const HASHTAGS = [];

module.exports = () => {
  return new Promise((resolve, reject) => {
    myCache.get(cacheKey, (err, value) => {
      console.log('get cache', value);
      if (err || value == undefined) resolve(retrieveToken());
      resolve(value)
    })
  })
  .then(getTweets)
}

function getTweets(res) {
  const screenNames = SCREEN_NAMES.map(i => 'from:' + i).join('+OR+');
  const options = {
    method: 'GET',
    uri: API_BASE_PATH + '/1.1/search/tweets.json?q=' + screenNames + '&tweet_mode=extended&count=30',
    headers: {
      'Authorization': 'Bearer ' + res.access_token
    },
    json: true
  }
  return rp(options).then(res => {
    return normalize.twitter(res.statuses);
  });
}

function retrieveToken() {
  const encoded_key = rawurlencode(CONSUMER_KEY);
  const encoded_secret = rawurlencode(CONSUMER_SECRET);
  const credentials = Buffer.from([encoded_key, encoded_secret].join(':')).toString('base64');
  const options = {
    method: 'POST',
    uri: API_BASE_PATH + '/oauth2/token',
    headers: {
      'Authorization': 'Basic ' + credentials,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    form: {
      'grant_type': 'client_credentials'
    },
    json: true
  }
  return rp(options).then(cache)
}

function cache (response) {
  return new Promise((resolve, reject) => {
    const obj = { access_token: response.access_token };
    myCache.set( cacheKey, obj, (err, success) => {
      if (err) reject(err);
      resolve(obj)
    })
  })
}