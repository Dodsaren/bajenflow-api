const Scraper = require('scraper');

const schema = {
  posts: [
    '.so-widget-aktuellt-widget .instance-block',
    {
      title: 'h3',
      subtitle: '.subtitle',
      link: ($, context) => $('a', context).attr('href'),
      message: '.content-block p',
      image: ($, context) => $(context).prev().children('img').attr('src'),
      video: ($, context) => $(context).prev().find('iframe').attr('src')
    }
  ],
}

module.exports = () => {
  return Scraper.get('http://www.hammarbyfotboll.se/', schema)
}