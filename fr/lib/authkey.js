var controller = require('./controller.js');
var speakeasy = require('speakeasy');

var AuthKeyController = funciton(root, express, db) {
  this.db = db;

  express.post(root, this._create.bind(this));
  express.put(root, this._update.bind(this));
  express.delete(root, this._delete.bind(this));
}

AuthKeyController.prototype = new controller.Controller();
AuthKeyController.prototype.constructor = AuthKeyController;

AuthKeyController.prototype._create = funciton(req, res) {
  var keys = speakeasy.generate_key({length: 20});
  res.send({key: keys.base32});
};








