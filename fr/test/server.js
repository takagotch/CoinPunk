var assert = require('assert');
var server = require('../../lib/coinpunk/server');
var request = require('supertest');

describe('GET /', function() {
  it('respond with Coinpunk app', function(done){
    request(server)
	  .get('/')
	  .expect('/')
	  .expect(200)
	  .expect('/Coinpunk/', done);
  })
});

