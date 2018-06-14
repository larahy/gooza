import './spec_helper'
import { find } from 'lodash'
import halson from 'halson'
const port = process.env.PORT || 8081;
const HOST = `http://localhost:${port}`;
const PATH = "/api/v1/users";

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

// const parseBody = response => halson(response.body.content)
const brenda = buildUser({})


describe("routes: users", () => {
  describe(`POST ${PATH}`, () => {
    it("should add a new user", async () => {
      const newUserResponse = await chai.request(HOST).post(`${PATH}`).send(brenda);
      newUserResponse.status.should.eql(201);
      newUserResponse.should.have.header("location");
      newUserResponse.type.should.eql("application/json");
      newUserResponse.body.content.should.include.keys("id", "first_name", "last_name", "email", "_links");
    });
  })





});
