var controller = require('./controller.js');

var TxController = function () {};

TxController.prototype = new controller.Controller();
TxController.prototype.constructor = TxController;

TxController.prototype._create = function(req, res) {
  this.insight.sendRawTransaction(req.body.tx, function(err, txid) {
    if (err) {
      return res.send({ error: 'insightServer', messages: [err]});
    }
    res.send({ hash: txid });
  });
};












