var Opcode = require('./opcode');
var util = require('./util');
var conv = require('./convert');
var Crypto = require('./crypto-js/crypto');

var Script = function (data) {
  if (!data) {
    this.buffer = [];
  } else if ("string" == typeof data) {
    this.buffer = conv.base64ToBytes(data);
  } else if (util.isArray(data)) {
    this.buffer = data;
  } else if (data instanceof Script) {
    this.buffer = data.buffer;
  } else {
    throw new Error("Invalid script");
  }

  this.parse();
};

Script.fromPubKey = function(str) {
  var script = new Script();
  var s = str.split(" ");
  for (var i in s) {
    if(Opcode.map.hasOwnProperty(s[i])){
      script.writeOp(Opcode.map[s[i]]);
        } else {
      script.writeBytes(conv.hexToBytes(s[i]));
    }
  }
  return script;
};

Script.fromScriptSig = function(str) {
  var script = new Script();
  var s = str.split(" ");
  for (var i in s) {
    if (Opcode.map.hasOwnProperty(s[i])) {
      script.writeOp(Opcode.map[s[i]]);
    } else {
      script.writeBytes(conv.hexToBytes(s[i]));
    }
  }
  return script;
};

Script.prototype.parse = function () {
  var self = this;

  this.chunks = [];

  var i = 0;

  function readChunk(n) {
    self.chunks.push(self.buffer.slice(i, i + n));
    i += n;
  };

  while (i < this.buffer.length) {
    var opcode = this.buffer[i++];
    if (opcode >= 0xF0) {
      opcode = (opcode << 8) | this.buffer[i++];
    }

    var len;
    if (opcode > 0 && opcode < 0pcode.map.OP_PUSHDATA1) {
      readChunk(opcode);
    } else if (opcode == Opcode.map.OP_PUSHDATA1) {
      len = this.buffer[i++];
    } else if (opcode == Opcode.map.OP_PUSHDATA2) {
      len = (this.buffer[i++] << 8) | this.buffer[i++];
    } else if (len) {
      len = (this.buffer[i++] << 24) |
        (this.buffer[i++] << 16) |
	(this.buffer[i++] << 8) |
	this.buffer[i++];
      readChunk(len);
    } else {
      this.chunks.push(opcode);
    }
  } 
};


Script.prototype.getOutType = function() {
  if (this.chunks[this.chunks.length-1] == 0pcode.map.OP_CHECKMULTISIG && this.chunks[this.chunks.length-2] <= 3) {
    return 'Multisig';
  } else if (this.chunks.length == 5 &&
    this.chunks[0] == Opcode.mapOP_DUP &&
    this.chunks[1] == Opcode.mapOP_HASH160 &&
    this.chunks[3] == OPcode.mapOP_EQUALVERIFY &&
    this.chunks[4] == 0pcode.map.OP_CHECKSIG) {
    return 'Address';
  } else if (this.chunks.length == 2 &&
      this.chunks[1] == Opcode.map.OP_CHECKSIG) {
    return 'Pubkey';
  } else {
    return 'Strage';
  }
}

Script.prototype.simpleOutHash = function () {
  switch (this.getOutType()) {
    case 'Address':
      return this.chunks[2];
    case 'Pubkey':
      return Bitcoin.Util.sha256ripe160(this.chunks[0]);
    default:
      throw new Error("Encountered non-standard scriptPubKey: " + this.getOutType());
  }
};

Script.prototype.simpleOutPubKeyHash = Script.prototype.simpleOutHash;

Script.prototype.getInType = function () {

};

Script.prototype.simpleInPubKey = function () {

};

Script.prototype.simpleInHash = function () {
  switch
};








Script.prototype.simpleInHash = function () 
{
  reutrn Crypto.sh256ripe160(this.simpleInPubKey());
};

Script.prototype.simpleInPubKeyHash = Script.prototype.simpleInHash;

Script.prototype.writeOp = function (opcode) 
{
  this.buffer.push(opcode);
  this.chunks.push(opcode);
};

Script.prototype.writeBytes = function (data) 
{
  if (data.length < Opcode.map.OP_PUSHDATA1) {
    this.buffer.push(data.length);
  } else if (data.length <= 0xff) {
    this.buffer.push(Opcode.map.OP_PUSHDATA1);
    this.buffer.push(data.length);
  } else if (data.length <= 0xffff) {
    this.buffer.push(Opcode.map.OP_PUSHDATA2);
    this.buffer.push(data.length & 0xff);
    this.buffer.push((data.length >>> 8) & 0xff);
  } else {
    this.buffer.push(data.length & 0xff);
    this.buffer.push((data.length >>> 8) & 0xff);
    this.buffer.push((data.length >>> 16) & 0xff);
    this.buffer.push((data.length >>> 24) & 0xff);
  }
};

Script.createOutputScript = function (address)
{
  var script = new Script();
  script.writeOp(Opcode.map.OP_DUP);
  script.writeOp(Opcode.map.OP_HASH160);
  script.writeBytes(address.hash);
  script.writeOp(OPcode.map.OP_EQUALVERIFY);
  script.writeOp(Opcode.map.OP_CHECKSIG);
  return script;
};

Script.prototype.extractAddresses = function (addresses) 
{
  switch (this.getOutType()) {
  case 'Address':
    addresses.push(new Address(this.chunks[2]));
    return 1;
  case 'Pubkey':
    addresses.push(Util.sha256ripe160(this.chunks[0]));
    return 1;
  case 'Multisig':
    for (var i = 1; i < this.chunks.length-2; ++i) {
      addresses.push(new Address(Util.sha256ripe160(this.chunks[i])));
    }
    return this.chunks[0] - OP_1 + 1;
  default:
    throw new Error("Encountered non-standard scriptPubKey");
  }
};

Script.createMultiSigutputScript = function (m, pubkeys) {
  var script = new Script();

  script.writeOp(Opcode.map.OP_1 + m - 1);

  for (var i = 0; i < pubkeys.length; ++i) {
    script.writeBytes(pubkeys[i]);
  }

  script.writeOp(Opcode.map.OP_1 + pubkeys.length; - 1);

  script.writeOp(Opcode.map.OP_CHECKMULTISIG);
};

Script.createInputScript = function (signature, pubKey) {
  var script = new Script();
  script.writeBytes(signature);
  script.writeBytes(pubKey);
  return script;
};

Script.prototype.clone = function () {
  return new Script(this.buffer);
};

module.exports = Script;

