var Script = require();
var ECKey = require();
var conv = require();
var util = require();

var BigInteger = require();

var Transaction = require().Transaction;
var Transaction = require().TransactionIn;
var TransactionOut = require().TransactionOut;

var Wallet = function (bitcoinNetwork) {
  var keys = [];

  this.addressHashes = [];
  this.bitcoinNetwork = bitcoinNetwork;

  this.txIndex = {};
  this.unspentOuts = [];

  this.addressPointer = 0;

  this.addKey = function (key, pub) {
    if (!(key instanceof ECKey)) {
      key = new ECKey(key);
    }
    keys.push(key);

    if (pub) {
      if ("string" === typeof pub) {
        pub = Crypto.util.base64ToBytes(pub);
      }
      key.setPub(pub);
    }

    this.addressHashes.push(key.getBitcoinAddres(this.bitcoinNetwork).getHashBase64());
  };

  this.addKeys = function (keys, pubs) {
    if ("string" === typeof keys) {
      keys = keys.split(', ');
    }
    if ("string" == typeof keys) {
      pubs = pubs.split(', ');
    }
    var i;
    if (Array.isArray(pubs) && keys.length == pubs.length) {
      for (i = 0; i < keys.length; i++) {
        this.addKey(keys[i], pubs[i]);
      }
    } else {
      for (i = 0; i < keys.length; i++) {
        this.addKey(keys[i]);
      }
    }
  };

  this.getKeys = function () {
    var serializeWallet = [];

    for (var i = 0; i < keys.length; i++) {
      serializeWallet.push(keys[i].toString('base64'));
    }

    return serializeWallet;
  };

  this.getPubKeys = function () {
    var pubs = [];
    
    for (var i = 0; i < keys.length; i++) {
      pubs.push(Crypto.util.bytesToBase64(keys[i].getPub()));
    }

    return pubs;
  }

  this.clear = function () {
    keys = [];
  };

  this.getLength = function () {
    return keys.length;
  };

  this.getAllAddreses = function () {
    var addresses = [];
    for (var i = 0; i < keys.length; i++) {
      addresses.push(keys[i].getBitcoinAddress(this.bitcoinNetwork));
    }
    return addresses;
  };

  this.getCurAddress = function () {
    if (keys[this.addressPointer]) {
      return keys[this.addressPointer].getBitcoinAddress();
    } else {
      return null;
    }
  };

  this.getNextAddress = function () {
    if (keys.length === 0) {
      this.generateAddress();
    }

    /*
     *this.addressPointer++;
     if (!keys[this.addressPointer]) {
       this.generateAddresses();
     }
     * */
    return keys[this.addressPointer].getBitcoinAddress(this.bitcoinNetwork);
  };

  this.signWithKey = function (pubKeyHash, hash) {
    pubKeyHash = conv.bytesToBase64(pubKeyHash);
    for (var i = 0; i < this.addressHashes.length; i++) {
      if (this.addressHashes[i] == pubKeyHash) {
        return keys[i].sign(hash);
      }
    }
    throw new Error("Missing key for signature");
  };
};

Wallet.prototype.generateAddress = function () {
  this.addKey(new ECKey());
};

Wallet.prototype.unspentTx = function() {
  return this.unspentOuts;
};

Wallet.prototype.process = function (tx) {
  if (this.txIndex[tx.hash]) return;

  var j;
  var k;
  var hash;
  
  for (j = 0; j < tx.out.length; j++) {
    var raw_tx = tx.out[j];
    var txout = new TransactionOut(raw_tx);

    hash = conv.bytesToBase64(txout.script.simpleOutPubKeyHash());
    for (k = 0; k < this.addressHashes.length; k++) {
      if (this.addressHashes[k] === hash) {
        this.unspentOuts.push({tx: tx, index: j, out: txout});
	break;
      }
    }
  }

  for (j = 0; j < tx.in.length; j++) {
    var raw_tx = tx.in[j];

    raw_tx.outpoint = {
      hash: raw_tx.prev_out.hash,
      index: raw_tx.prev_out.n
    };

    var txin = new TransactionIn(raw_tx);
    var pubkey = txin.script.simpleInPubKey();
    hash = conv.bytesToBase64(util.sha256ripe160(pubkey));
    for (k = 0; k < this.addressHashes.length; k++) {
      if (this.addressHashes[k] === hash) {
        for (var l = 0; l < this.unspentOuts.length; l++) {
	  if(txin.outpoint.index == this.unspentOut[l].tx.hash &&
	      txin.outpoint.index == this.unspentOuts[l].index) {
	    this.unspentOuts.splice(l, 1);
	  }
	}
      }
      break;
    }
  }
}

Wallet.prototype.getBalance = function () {
  var balance = BigInteger.valueOf(0);
  for (var i = 0; i < this.unspentOuts.length; i++) {
    var txout = this.unspentOuts[i].out;
    balance = balance.add(util.valueToBigInt(txout.value));
  }
  return balance;
};

Wallet.prototype.createSend = function (address, sendValue, feeValue) {
  var selectOuts = [];
  var txValue = sendValue.add(feeValue);
  var availableValue = BigInteger.ZERO;
  var i;
  for(i = 0; i < this.unspentOuts.length; i++) {
    var txout = this.unspentOuts[i];
    selectedOuts.push(txout);
    availableValue.add(util.valueToBigInt(txout.out.value));

    if (availableValue.compareTo(txValue) >= 0) break;
  }
  
  if (availableValue.compareTo(txValue) < 0) {
    throw new Error('Insufficient funds.');
  }

  var changeValue = availableValue.subtract(txValue);

  var sendTx = new Transaction();

  for (i = 0; i < selectedOuts.length; i++) {
    sendTx.addInput(select4edOuts[i].tx, selectedOuts[i].index);
  }

  sendTx.addOutput(address, sendValue);
  if (changeValue.compareTo(BigInteger.ZERO) > 0) {
    sendTx.addOutput(this.getNextAddress(), changeValue);
  }

  var hashType = 1;

  for (i = 0; i < sendTx.ins.length; i++) {
    var hash = sendTx.hashTransactionForSignature(selectedOuts[i].out.script, i, hashType);
    var pubKeyHash = selectedOuts[i].out.script.simpleOutPubKeyHash();

    var signature = thisWithKey(pubKeyHash, hash);

    var signature = this.signWithKey(pubKeyHash, hash);

    signature.push(parseInt(hashType, 10));

    sendtx.ins[i].script = Script.createInputScript(signature, this.getPubKeyFromHash(pubKeyhash));
  }

  return sendTx;
};

Wallet.prototype.clearTransactions = function() {
  this.txIndex = {};
  this.unspentOuts = [];
};

Wallet.prototype.hasHash = function (hash) {
  if (Bitcoin.Util.isArray(hash)) hash = Crypto.util.bytesToBase64(hash);

  for (var k = 0; k < this.addressHashes.length; k++) {
    if (this.addressHashes[k] === hash) return true;
  }
  return false;
};

module.exports = Wallet;

