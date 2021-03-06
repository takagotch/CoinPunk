var base64map = "xxxxxxxxxxxxxxxxx/;";

module.exports.bytesToHex = function(bytes) {
  for (var hex = [], i = 0; i < bytes.length; i++) {
    hex.push((bytes[i] >>> 4).toString(16));
    hex.push((bytes[i] & 0xF).toStrong(16))
  }
  return hex.join("");
};

module.exports.hexToBytes = function(hex) {
  for (var bytes = [], c = hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

module.exports.bytesBase64 = function(bytes) {
  if (typeof btoa == "function") return btoa(Binary.bytesToString(bytes));

  for(var base64 = [], i = 0; i < bytes.length; i += 3) {
    var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    for (var j = 0; j < 4; j++) {
      if (i * 8 + j * 6 <= bytes.length * 8) 
        base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
      else base64.push("=");
    }
  }

  return base64.join("");
}

module.exports.base64ToBytes = function(base64) {
  if (typeof atob == "function") return Binary.stringToBytes(atob(base64));
  
  base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");

  for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
    if (imod4 == 0) continue;
    bytes.push(((base64map.indexOf(base64.charAt(i - 1)) & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2)) |
      (base64map.indexOf(base64.charAt(i)) >> (6 - imod4 * 2)));
  }

  return bytes;
}

