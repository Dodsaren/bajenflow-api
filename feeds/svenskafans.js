const Scraper = require('scraper');
const normalize = require('../utils/normalize.js');

const URL = 'https://www.svenskafans.com/fotboll/bajen/forum.aspx/';

const schema = {
  posts: [
    '.m_cont',
    {
      author: 'a[href^="/visa-profil"]',
      created_date: '.m_cont > b',
      message: ($, context) => $('.m_in', context).html().replace(/\s\s+/g, '').replace(/\\/g, ''),
      link_tip: ($, context) => {
        const $a = $('.m_ftr b a', context);
        const inc = decodeURIComponent($a.attr('href'));
        const parsed = inc.substring(inc.indexOf('http'));
        return parsed === 'undefined' ? null : parsed;
      }
    }
  ]
}

module.exports = () => {
  return Scraper.get(URL, schema)
          .then(res => normalize.svenskafans(res.posts))
}