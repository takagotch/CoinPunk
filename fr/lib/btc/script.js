var Opcode = require('./opcode');
var util = require('./util');
var conv = require('./convert');
var Crypto = require('./crypto-js/crypto');

var Script = function (data) {
  if (!data) {
    this.buffer = [];
  } else if ("string" == typeof data) {
    this.buffer = conv.base64ToBytes(data);
  } else if () {
  
  } else if () {
  
  } else {
  
  }

  this.parse();
};











