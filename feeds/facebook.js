const rp = require('request-promise');
const normalize = require('../utils/normalize.js');

const APP_ID = process.env.FACEBOOK_APP_ID;
const APP_SECRET = process.env.FACEBOOK_APP_SECRET;

const API_BASE_PATH = 'https://graph.facebook.com';

const GROUPS = [
  'BajenFans1981',
  'Bajenland'
]

const FIELDS = [
  'created_time',
  'message',
  'full_picture.as(image)',
  'link',
  'from',
  'type'
]

module.exports = () => {
  const promises = GROUPS.map(id => {
    const fields = FIELDS.join(',');
    const options = {
      method: 'GET',
      uri: `${API_BASE_PATH}/v2.12/${id}/feed?fields=${fields}&access_token=${APP_ID}|${APP_SECRET}`,
      json: true
    }
    return rp(options)
  })
  return Promise.all(promises)
  .then(res => normalize.facebook(
    res.reduce((acc, cur) => acc.concat(cur.data), [])
    .sort((a, b) => {
      const A = new Date(a.created_time);
      const B = new Date(b.created_time);
      return A > B ? -1 : A < B ? 1 : 0;
    })) 
  )
}