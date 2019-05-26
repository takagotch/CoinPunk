module.exports = {
  stringBytes: function (str) {
    for (var bytes = [], i = 0; i < str.length; i++)
      bytes.push(str.charCodeAt(i));
    return bytes;
  },

  bytesToString: function (bytes) {
    for (var str = [], i = 0; i < bytes.length; i++)
      str.push(String.fromCharCode(bytes[i]));
    return str.join("");
  }
};

