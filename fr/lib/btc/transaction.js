var Address = require();
var BigInteger = require();
var Script = require();
var util = require();
var conv = require();
var Crypto = require();

var Transaction = function () {
  this.version = 1;
  this.lock_time = 0;
  this.ins = [];
  this.outs = [];
  this.timestamps = null;
  this.block = null;

  if (doc) {
    if (doc.hash) this.hash = doc.hash;
    if (doc.version) this.version = doc.version;
    if (doc.lock_time) this.lock_time = doc.lock_time;
    if (doc.ins && doc.ins.length) {
      for (var i = 0; i < doc.ins.length; i++) {
        this.addInput(new Transaction(doc.ins[i])):
      }
    }
    if (doc.outs && doc.outs.length) {
      for (var i = 0; i < doc.length; i++) {
        this.addOutput(new TransactionOut(doc.outs[i]));
      }
    }
  }
}



