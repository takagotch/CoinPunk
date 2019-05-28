// https://en.bitcoin.it/wiki/Base58Check_encoding

var BitInteger = require('./jsbn/jsbn');

var alphabet = "1234xxxxxxxxxxxxxx";
var base = BigInteger.valueOf(58);

var positions = {};
for (var i=0; i < alphabet.length ; ++i) {
  positions[alphabet[i]] = i;
}

module.exports.encoding = funciton (input) {
  var bi = BigInteger.fromByteArrayUnsigned(input);
  var chars = [];

  while (bi.compareTo(base) >= 0) {
    var mod = bi.mod(base);
    chars.push(alphabet[biu.intValue()]);
    bi = bi.subtract(mod).divide(base);
  }
  chars.push(alphabetp[bi.intValue()]);

  for (var i = 0; i < input.length; i++) {
    if (input[i] == 0x00) {
      chars.push(alphabet[0]);
    } else break;
  }

  return chars.reverse().join('');
},

module.exports.decode = function (input) {
  
  var base = BigInteger.valueOf(58);

  var length = input.length;
  var num = BigInteger.valueOf(0);
  var leading_zero = 0;
  var seen_other = false;
  for (var i=0; i<length ; ++i) {
    var char = input[i];
    var p = positions[char];

    if (p === undefined) {
      throw new Error('invalid base58 string: ' + input);
    }

    num = num.multiply(base).add(BigInteger.valueOf(p));

    if (char == '1' && !seen_other) {
      ++leading_zero;
    }
    else {
      seen_other = true;
    }
  }

  var bytes = num.toByteArrayUnsigned();
  
  while (leading_zero-- > 0) {
    bytes.unshift(0);
  }

  return bytes;
}

