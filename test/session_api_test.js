import './spec_helper'
import {find} from 'lodash'
import halson from 'halson'

const port = process.env.PORT || 8081;
const HOST = `http://localhost:${port}`;
const PATH = "/api/v1/session";

const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const buildUser = ({
                     first_name = 'Brenda',
                     last_name = 'Chan',
                     email = 'brenda@example.com',
                     password = 'brenda'
                   } = {}) => {
  return {
    first_name,
    last_name,
    email,
    password
  }
}

const parseBody = response => halson(response.body.content)
const brenda = buildUser({})


describe("routes: session", () => {
  describe(`POST ${PATH}`, () => {
    it("should return a token for a successfully logged in user", async () => {
      await chai.request(HOST).post(`/api/v1/users`).send(brenda);
      const loggedInUserResponse = await chai.request(HOST).post(`/api/v1/session`).send({email: brenda.email, password: brenda.password})
      const loggedInUser = parseBody(loggedInUserResponse)
      loggedInUserResponse.status.should.eql(200);
      loggedInUserResponse.type.should.eql("application/json");
      loggedInUser.should.include.keys("token");
    });

    it("should return a 500 response for incorrect email", async () => {
      try {
        await chai.request(HOST).post(`/api/v1/session`).send({email: "bogus email", password: "incorrect Password"})
      } catch (error) {
        error.status.should.eql(500);
      }
    });
    it("should return a 401 response for incorrect password", async () => {
      await chai.request(HOST).post(`/api/v1/users`).send(brenda);
      try {
        await chai.request(HOST).post(`/api/v1/session`).send({email: brenda.email, password: "incorrect Password"})
      } catch (error) {
        error.status.should.eql(401);
      }
    });
  })


});
