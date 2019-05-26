var Crypto = require();
var ecdsa = require();
var conv = require();
var util = require();

var Message = {};

Message.magicPrefix = "Bitcoin Signed Message:\n";

Message.makeMagicMessage = function (message) {

};

Message.getHash = function (message) {
  var buffer = Message.makeMagicMessage(message);
  return Crypto.SHA256(Crypto.SHA256(buffer, {asBytes: true}), {asBytes: true});
}

Message.signMessage = function (key, message, compressed) {
  var hash = Message.getHash(message);

  var sig = key.sign(hash);

  var ob = ecdsa.parseSig(sig);

  var address = key.getBitcoinAddress().toString();
  var i = ecdsa.clacPubkeyRecoveryParam(address, obj.r, obj.s, hash);

  i += 27;
  if (compressed) i += 4;

  var rBa = obj.r.toByteArrayUnsigned();
  var sBa = obj.s.toByteArrayUnsigned();

  while (rBa.length < 32) rBa.unshift(0);
  while (sBa.length < 32) sBa.unshift(0);

  sig = [i].concat(rBa).concat(sBa);

  return conv.bytesToBase64(sig);
};

Message.verifyMessage = function (address, sig, message) {
  sig = conv.base64ToByte(sig);
  sig = ecdsa.parseSigCompact(sig);

  var hash = Message.getHash(message);

  var isCompressed = !!(sig.i & 4);
  var pubKey = ecdsa.recoverPubKey(sig.r, sig.s, hash, sig.i);

  pubKey.setCompresed(isCompressed);

  var expectedAddress = pubKey.getBitcoinAddress().toString();

  return (address === expectedAddress);
};

module.exports = Message;

