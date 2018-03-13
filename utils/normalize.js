const dateFormatter = require('./dateFormatter.js');

const obj = (title, text, image, video, date, author, link) => {
  return {
    title,
    text,
    image,
    video,
    date,
    author,
    link
  }
}

module.exports = {
  twitter: (data) => data.map(i => obj(
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
    i.message,
    null,
    null,
    new dateFormatter(i.created_time).standard(),
    i.from ? i.from.name : null,
    "https://facebook.com/" + i.id
  )),
  svenskafans: (data) => data.map(i => obj(
    null,
    i.message,
    null,
    null,
    new dateFormatter(i.created_date).noSeconds(),
    i.author, // TODO: Do something about author names that has the string "Tippar" in them
    null
  )),
  hammarbyfotboll: (data) => data.map(i => obj(
    i.title, // This struct also has subtitle
    i.message,
    i.image,
    i.video,
    null,
    null,
    i.link
  ))
}