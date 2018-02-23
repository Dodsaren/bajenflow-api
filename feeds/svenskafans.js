const Scraper = require('scraper');

const schema = {
  posts: [
    '.m_cont',
    {
      author: 'a[href^="/visa-profil"]',
      created_date: '.m_cont > b',
      message: ($, context) => $('.m_in', context).html().replace(/\s\s+/g, '')
    }
  ]
}

module.exports = () => {
  return Scraper.get('https://www.svenskafans.com/fotboll/bajen/forum.aspx', schema)
}