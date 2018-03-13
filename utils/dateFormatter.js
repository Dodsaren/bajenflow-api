const YMDHM = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
};

const YMDHMS = Object.create(YMDHM, {
  second: { value: '2-digit' }
});

const format = function(date) {
  this.date = new Date(date);
}

format.prototype.standard = function() {
  return this.date.toLocaleString("sv-SE", YMDHMS);
}

format.prototype.noSeconds = function() {
  return this.date.toLocaleString("sv-SE", YMDHM);
}

module.exports = format;