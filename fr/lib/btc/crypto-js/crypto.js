var charenc = require('./charenc');

module.exports.util = {
  randomBytes: function (n) {
    for (var bytes = []; n > 0; n--)
      bytes.push(Math.floor(Math.random() * 256));
    return bytes;
  }
};

module.exports.UTF8 = charenc.UTF8;
module.exports.Binary = charenc.Binary;

module.exports.charenc = charenc;
module.exports.SHA256 = require('./sha256');
module.exports.RIPEMD160 = require('./ripemd160');


