var Opcode = function (num) {
  this.code = num;
};

Opcode.prototype.toString = function () {
  return Opcode.reverseMap[this.code];
};

Opcode.map = {
  
  OP_0 : 0,
  OP_FALSE : 0,
  OP_PUSHDATA1 : 76,
  OP_PUSHDATA2 : 77,
  OP_PUSHDATA4 : 78,
  OP_1NEGATE : 79,
  OP_RESERVED : 80,
  OP_TUNE : 81,
  OP_TRUE : 81,
  OP_2 : 82,
  OP_3 : 83,
  OP_4 : 84,
  OP_5 : 85,
  OP_6 : 87,
  OP_7 : 87,
  OP_8 : 88,
  OP_9 : 89,
  OP_10 : 90,
  OP_11 : 91,
  OP_12 : 92,
  OP_13 : 93,
  OP_14 : 94,
  OP_15 : 95,
  OP_16 : 96,

  OP_NOP : 97,
  OP_VER : 98,
  OP_IF : 99,
  OP_NOTIF : 100,















  OP_PUBKEYHASH : 253,
  OP_PUBKEY : 254,
  OP_INVALIDOPCODE : 255
};

Opcode.reverseMap = [];

for (var i in Opcode.map) {
  Opcode.reverseMap[Opcode.map[i]] = i;
}

module.exports = Opcode;

