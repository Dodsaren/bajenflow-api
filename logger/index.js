const formatter = require('../utils/dateFormatter.js');

module.exports = (req, res, next) => {
  const start = new Date();
  console.log('%s %s %s', new formatter(start).standard(), req.method, req.path);
  res.on('finish', () => {
    const diff = new Date() - start;
    console.log('Finished in %s ms', diff);
  })
  next();
}