import request from "supertest";
import app from "../../index";
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
const expect = chai.expect;

describe('User API', () => {
  describe('POST /api/register', () => {
    it('should handle user registration', (done) => {
      console.log(`\n\n AAAAAAAAA app: ${app} \n\n`);

      chai.request(app)
        .post('/register')
        .send({ username: 'testUser', password: '123456' })
        .end((err, res) => {
          console.log(`\n\n AAAAAAAAA res: ${res} \n\n`);
          console.log(`\n\n AAAAAAAAA res: ${JSON.stringify(res)} \n\n`);

          if (err) {
            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.is.equal('An error occurred!!');
          } else {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('message').equal('User registered successfully');
          }

          done();
        });
    });
  });
});
