// process.env.NODE_ENV = 'test';
//
//
// const port = process.env.PORT || 8080;
// const HOST = `http://localhost:${port}`;
// const PATH = "/hello/lara";
//
// const chai = require("chai");
// const should = chai.should();
// const chaiHttp = require("chai-http");
// chai.use(chaiHttp);
// const server = require('../server');
//
// //Our parent block
// describe('hello', () => {
//   describe('basic hello', () => {
//     it('it should say Hello', (done) => {
//       chai.request(HOST)
//         .get(PATH)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.eql('hello lara');
//           done();
//         });
//     });
//   });
//
// });