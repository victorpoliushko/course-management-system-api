import request from "supertest";
import app from "../../index";
import { expect } from "chai";

// describe("Server test", () => {
//   it("server is created without errors", (done) => {
//     const response = request(app)
//       .get("/")
//       .expect(200)
//       .end((err) => {
//         if (err) return done(err);
//         done();
//       });
//       console.log(`\n\n AAAAAA server res: ${ JSON.stringify(response) }\n\n`);
//   });
// });

// describe('Auth Tests', () => {
//   it("registration done without errors", (done) => { // Note the 'done' parameter
//     request(app)
//       .post('/register')
//       .send({
//         username: 'test-user',
//         password: '123456',
//       })
//       .end((err, response) => {
//         if (err) {
//           done(err); // Pass any error to 'done' to indicate a failed test
//         } else {
//           expect(response.status).to.equal(200);
//           done(); // Call 'done' to indicate the test is complete
//         }
//       });
//   });
// });


// describe('Auth Tests', () => {
//   it("registration done without errors", async () => {
//     const response = await request(app)
//       .post('/register')
//       .send({
//         username: 'test-user',
//         password: '123456',
//       });
//       setTimeout(() => {
//         console.log("Delayed for 1 second.");
//       }, 2000);
    
//     expect(response.status).to.equal(200);
//   });
// });

// describe('Auth Tests', () => {
//   it("login done without errors", async () => {
//     const response = await request(app)
//       .post('/login')
//       .set('content-type', 'application/json')
//       .send({ 
//         username: "instructor2", 
//         password: "123456" 
//       })
//       setTimeout(() => {
//         console.log("Delayed for 1 second.");
//         expect(response.status).to.equal(200);
//       }, 3000);
//   });
// });
