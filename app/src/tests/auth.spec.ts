import { describe } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
chai.should();

describe("App", () => {
  describe("GET /", () => {
    it("should get hello world", (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});

describe("Auth", () => {
  describe("GET /logout", () => {
    it("should do logout", (done) => {
      chai.request(app)
        .get('/auth/logout')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});

describe("Auth", () => {
  describe("POST /login", () => {
    it("should do login", (done) => {
      chai.request(app)
        .post('/auth/login')
        .send({
          username: 'admin',
          password: '123456',
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
