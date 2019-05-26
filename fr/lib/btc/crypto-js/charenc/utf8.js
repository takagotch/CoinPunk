var binary = require('./binary');

module.exports = {
  stringToBytes: function (str) {
    return binary.stringToBytes(unescape(encodeURIComponent(str)));
  },

  bytesToString: function (bytes) {
    return decodedURIComponent(escape(binary.bytesToString(bytes)));
  }
};

