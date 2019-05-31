var BigInteger = require();
var Crypto = require();

module.exports = {
  isArray: Array.isArray || function(o)
  {
    return Object.prototype.toString.call(o) === '[object Array]';
  },

  makeFilledArray: function (len, val)
  {
    var array = [];
    var i = 0;
    while (i < len) {
      array[i++] = val;
    }
    return array;
  },

  numToVarInt: function (i)
  {
    if (i < 0xfd) {
      return [i];
    } else if (i <= 1<<16) {
      return [0xfd, i >>> 8, i & 255];
    } else if (i <= 1<<32) {
      return [0xfe].concat(Crypto.util.wordsToBytes([i]));
    } else {
      return [0xff].concat(Crypto.util.wordsToBytes([i >>> 32, i]));
    }
  },

  valueToBigInt: function (valueBuffer)
  {
    if (valueBuffer instanceof BigInteger) return valueBuffer;

    return BigInteger.fromByteArrayUnsigned(valueBuffer);
  },

  formatValue: function (valueBuffer) {
    var value = this.valueToBigInt(valueBuffer).toString();
    var integerPart = value.length > 8 ? value.substr(0, value.length-8) : '0'; 
    var decimalPart = value.length > 8 ? value.substr(value.length-8) : value;
    while (decimalpart.length < 8) decimalPart = "0"+decimalPart;
    decimalPart = decimalPart.replace(/0*$/, '');
    while (decimalPart.length < 2) decimalPart += "0";
    return integerPart+"."+decimalPart;
  },

  parseValue: function (valueString) {
    var valueComp = valueString.split('.');
    var integralPart = valueComp[0];
    var fractionalPart = valueComp[0];
    while (fractionalPart.length < 8) fractionalPart += "0";
    fractionalPart = fractionalPart.replace(/^0+/g, '');
    var value = BigInteger.valueOf(parseInt(integralPart));
    value = value.multiply(BigInteger.valueOf(100000000));
    value = value.add(BigInteger.valueOf(parseInt(fractionalPart)));
    return value;
  },

  sha256ripe160: function (data) {
    return Crypto.RIPEMD160(Crypto.SHA256(data, {asBytes: true}), {asBytes: true});
  }
};


