const dateFormatter = require('./dateFormatter.js');

// Output
const obj = (title, subtitle, text, image, video, date, author, link) => {
  return { title, subtitle, text, image, video, date, author, link }
}

module.exports = {
  twitter: (data) => data.map(i => obj(
    null,
    null,
    i.full_text,
    null,
    null,
    new dateFormatter(i.created_at).standard(),
    i.user.name,
    "https://twitter.com/statuses/" + i.id_str
  )),
  facebook: (data) => data.map(i => obj(
    null,
    null,
    i.message,
    i.image,
    null,
    new dateFormatter(i.created_time).standard(),
    i.from ? i.from.name : null,
    "https://facebook.com/" + i.id
  )),
  svenskafans: (data) => data.map(i => obj(
    null,
    null,
    i.message,
    null,
    null,
    new dateFormatter(i.created_date).noSeconds(),
    (() => i.author.indexOf('Tippar') === -1 ? i.author : 
      i.author.substring(0, i.author.indexOf('Tippar')))(),
    i.link_tip
  )),
  hammarbyfotboll: (data) => data.map(i => obj(
    i.title,
    i.subtitle,
    i.message,
    i.image,
    i.video,
    null,
    null,
    i.link
  ))
}