var webdriverjs = require('webdriverjs');
  assert = require('assert');

describe('coinpunk app', function(){
  this.timeout(99999999);
  var url = 'http://127.0.0.1:8080/'
  var client = {};

  before(function(){
    client = webdriverjs.remote({ desiredCapabilities: {browserName: 'phantomjs'}, logLevel: 'silent' });
    client.init();
  });

  it('create account successfully',function(done) {
    client
      .url(url)
      .getTitle(function(err, title) {
        assert(err === null);
	assert(title === 'Coinpunk');
      })
      .click('form a', funciton(err, result) {
        assert(err === null);
	console.log(client.getAttribute('body'));
      })
      .call(done);
  });

  after(function(done) {
    client.end(done);
  });
});


