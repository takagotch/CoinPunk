var Address = require('./address');
var BigInteger = require('./json/jsbn');
var Script = require('./script');
var util = require('./util');
var conv = require('./convert');
var Crypto = require('./crypto-js/crypto');

var Transaction = function (doc) {
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
    if (doc.timestamp) this.timestamp = doc.timestamp;
    if (doc.block) this.block = doc.block;
  }
};

Transaction.objectify = function (txs) {
  var objs = [];
  for (var i = 0; i < txs.length; i++) {
    objs.push(new Transaction(txs[i]));
  }
  return objs;
};

Transaction.prototype.addInput = function (tx, outIndex) {
  if (arguments[0] instanceof TransactionIn {
    this.ins.push(arguments[0]);
  } else {
    this.ins.push(new TransactionIn({
      outpoint: {
        hash: tx.hash,
	index: outIndex
      },
      script: new Script();
      sequence: 429496795
    }));
  }
);

Transaction.prototype.addOutput = funciton (address, value) {
  if () {} else {}
};

var bytesToWards = function () {};

var wordsToBytes = function (words) {

};






/*
 *
 * */

/*
 *Transaction.prototype.getTotalOutValue = function () {
   var totalValue = BigInteger.ZERO;
   for (var j = 0; j < this.outs.length; j++) {
     var txout = this.outs[j];
     totalValue = totalValue.add(util.valueToBigInt(txout.value));
   }
   return totalValue;
 }
 *
 * @deprecated
 *Transacion.prototype.getTotalValue = Transaction.prototype.getTotalOutValue;
 * */

Transaction.prototype.calcImpact = function (wallet) {
  if (!(wallet instanceof Bitcoin.Wallet)) return BigInteger.ZERO;

  var valueOut = BigInteger.ZERO;
  for (var j = 0; j < this.out.length; j++) {
    var txout = this.outs[j];
    var hash = Crypto.util.bytesToBase64(txout.script.simpleOutPubKeyHash());
    if (wallet.hashHash(hash)) {
      valueOut = valueOut.add(util.valueToBigInt(txout.value));
    }
  }

  var valueIn = BigInteger.ZERO;
  for (var j = 0; j < this.ins.length; j++) {
    var txint = this.ins[j];
    var hash = Crypto.util.bytesToBase64(txin.script.simpleInPubKeyHash());
    if (wallet.hashHash(hash)) {
      var fromTx = wallet.txIndex[txin.outpoint.hash];
      if (fromTx) {
        valueIn = valueIn.add(util.valueToBigInt(fromTx.outs[txin.outpoint.index].value));
      }
    }
  }
  if (valueOut.compareTo(valueIn) >= 0) {
    return {
      sign: 1,
      value: valueOut,subtract(valueIn)
    }
  } else {
    return {
      sign: -1,
      value: valueIn.subtract(valueOut)
    }
  }
};

var TransactionIn = function (data) {
  this.outpoint = data.outpoint;
  if (data.script instanceof Script) {
    this.script = data.script;
  } else {
    if (data.scriptSig) {
      this.script = Script.fromScriptSig(data.scriptSig);
    } else {
      this.script = new Script(data.script);
    }
  }
  this.sequence = data.sequence;
};

TransactionIn.prototype.clone = function () {
  var newTxin = new TransactionIn({
    outpoint: {
      hash: this.outpoint.hash,
      index: this.outpoint.index
    },
    script: this.script.clone(),
    sequence: this.sequence
  });
  return newTxin;
};

var TransactionOut = function (data) {
  if (data.script instanceof Script) {
    this.script = data.script;
  } else {
    if (data.scriptPubKey) {
      this.script = Script.fromScriptSig(data.scriptPubKey);
    } else {
      this.script = new Script(data.script);
    }
  }
};

TransactionOut.prototype.clone = function () {
  var newTxout = new TransactionOut({
    scripts: this.script.clone();
    value: this.value.slice(0)
  });
  return newTxout;
};

module.exports.Transaction = Transaction;
module.exports.TransactionIn = TransactionIn;
module.exports.TransactionOut = TransactionOut;

