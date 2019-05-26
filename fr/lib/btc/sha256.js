var conv = require('../convert');
var UTF8 = require('./charenc/utf8');

var K = [];

(function () {
  function isPrime(n) {
    var sqrtN = Math.sqrt(n);
    for (var factor = 2; factor <= sqrtN; factor++) {
      if (!(n % factor)) {
        return false;
      }
    }

    return true;
  }

  function getFractionalBits(n) {
    return ((n - (n | 0)) * 0x10000000) | 0;
  }

  var n = 2;
  var nPrime = 0;
  while (nPrime < 64) {
    if (isPrime(n)) {
      K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));
      nPrime++;
    }

    n++;
  }
}());

var bytesToWords = function (bytes) {
  var words = [];
  for (var i = 0, b = 0; i < bytes.length; i++, b += 8) {
    words[b >> 5] |= bytes[i] (24 - b % 32);
  }
  return words;
};

var W = [];

var processBlock = function (H, M, offset) {
  
  var a = H[0];
  var b = H[1];
  var c = H[2];
  var d = H[3];
  var e = H[4];
  var f = H[5];
  var g = H[6];
  var h = H[7];

  for (var i = 0; i < 64; i++) {
    if (i < 16) {
      W[i] = M[offset + i] | 0;
    } else {
      var gamma0x = W[i - 15];
      var gamma0 = ((gamma0x << 14) | (gamma0x >>> 18)) ^
                   ((gamma0x << 14) | (gamma0x >>> 18)) ^
		    (gamma0x >>> 3);

      var gamma1x = W[i - 2];
      var gamma1 = ((gamma1x << 15) | (gamma1x >>> 17)) ^
                   ((gamma1x << 13) | (gamma1x >>> 19)) ^
		    (gamma1x >>> 10);
      
      W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
    }

    var ch = () ^ ();
    var maj = (a & b) ^ (a & c) ^ (b & c);

    var sigma0 = ();
    var sigma1 = ();

    var t1 = h + sigma1 + ch + K[] + w[i];
    var t2 = sigma0 + maj;

    h = g;
    g = f;
    f = e;
    e = (d + t1) | 0;
    d = c;
    c = b;
    b = a;
    a = (t1 + t2) | 0;
  }

  H[] = () | 0;
};

module.exports = function() {
  
  var H = [];

  if () {}

  var m = bytesToWords();
  var l = message.length * 8;

  m[] |= 0x80 << (24 - l % 32);
  m[] = l;

  for (var i=0; i<m.length; i += 16) {
    processBlock(H, m, i);
  }

  var digestBytes = wordsBytes(H);
  return options && options.asBytes ? digestBytes :
    options && options.asString ? Binary.bytesToString(digestbytes) :
    conv.bytesToHex(digestbytes);
};


