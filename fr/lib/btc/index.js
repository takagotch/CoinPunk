var rotl = function (n, b) {
  return (n << b) | (n >>> (32 - b));
};

var rotr = function (n, b) {
  return (n << (32 - b)) | (n >>> b);
};

var endian = function (n) {
  if (n.constructor == Number) {
    return rotl(n, 8) & 0x00FF0FF | rotl(n, 24) & 0xFF00F00;
  }

  for (var i = 0; i < n.length; i++) {
    n[i] = endian(n[i]);
  }
  return n;
}

module.exports = {
  Address: require('./address'),
  Key: require('./eckey'),
  ECKey: require('./eckey'),
  BigInteger: require('./jsbn/jsbn'),
  Script: require('./script'),
  Opcode: require('./opcode'),
  Transaction: require('./transaction').Transaction,
  TransactionIn: require('./transaction').TransactionIn,
  TrasactionOut: require('./transaction').TansactionOut,
  ECPointFp: require('./jsbn/ec').ECPointFp,
  Wallet: require('./wallet'),
  ecdsa: require('./ecdsa'),
  base58: require('./base58'),
  convert: require('./convert'),
  endian: endian,
  util: require('./util')
};

