const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../server.js');

chai.use(chaiHttp);

describe('Server', () => {
  it('should exist', () => {
    expect(app).to.exist;
  });

  describe('GET /', function() {
    it('should return a 200 and html', function(done) {
      chai.request(app)
      .get('/')
      .end(function(err, res) {
        if (err) { done(err); }
        expect(res).to.have.status(200);
        expect(res).to.be.html;
        done();
      });
    });
  });

  describe('GET /api/v1/pizzas', function() {
    beforeEach(function(done){
      const pizzas = [{type: 'cheese'},
                      {type: 'meat'},
                      {type: 'pineapple'},
                      {type: 'sardine'}];
      app.locals.pizzas = pizzas;
      done();
    });

    afterEach(function(done){
      app.locals.pizzas = [];
      done();
    });

    it('should return all pizzas', function(done) {
      chai.request(app)
      .get('/api/v1/pizzas')
      .end(function(err, res) {
        if (err) { done(err); }
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.equal(4);
        expect(res.body[0]).to.have.property('type');
        done();
      });
    });
  });
});