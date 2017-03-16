const chai = require('chai');
const should = chai.should();
const assert = chai.assert;
const chaiHttp = require('chai-http');
const server = require('../server.js');

chai.use(chaiHttp);

describe('Server', () => {
  it('should exist', () => {
    assert(server);
  });

  describe('GET /', function() {
    it('should return html', function(done) {
      chai.request(server)
      .get('/')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done();
      });
  });
});

});