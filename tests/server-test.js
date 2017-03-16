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

  describe('GET /api/v1/pizza/:id', function() {
    beforeEach(function(done){
      const pizzas = [{type: 'vodka', id: 1},
                      {type: 'sausage', id: 2}];
      app.locals.pizzas = pizzas;
      done();
    });

    afterEach(function(done){
      app.locals.pizzas = [];
      done();
    });

    context('if pizza is found', function(){
      it('should return a specific pizza', function(done) {
        chai.request(app)
        .get('/api/v1/pizza/2')
        .end(function(err, res) {
          if (err) { done(err); }
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('type');
          expect(res.body.type).to.equal('sausage');
          done();
        });
      });
    });

    context('if no pizza is found', function(){
      it('should return a 404', function(done) {
        chai.request(app)
        .get('/api/v1/pizza/3')
        .end(function(err, res) {
          expect(res).to.have.status(404);
          expect(res.body).to.be.a('object');
          done();
        });
      });
    });
  });

  describe('POST /api/v1/pizzas', function() {
    afterEach(function(done){
      app.locals.pizzas = [];
      done();
    });

    context('if pizza is valid', function(){
      it('should return a specific pizza', function(done) {
        chai.request(app)
        .post('/api/v1/pizzas')
        .send({
          type: 'cheese'
        })
        .end(function(err, res) {
          if (err) { done(err); }
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('type');
          expect(res.body.type).to.equal('cheese');
          done();
        });
      });
    });

    context('if pizza is not valid', function(){
      it('should return a 422 Unprocessable Entity status code');
    });
  });
});