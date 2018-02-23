/**
 * Encode a string according to RFC 1738 standard
 * @param {*string to encode} str 
 */
module.exports = str => {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
}