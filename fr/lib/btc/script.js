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

};




module.exports = Script;

