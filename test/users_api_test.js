import './spec_helper'
import {find} from 'lodash'
import halson from 'halson'
import {loggedInUserTokenAndId} from './helpers/sessions'
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

const parseBody = response => halson(response.body.content)
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

  describe(`GET ${PATH}`, () => {
    it('returns a list of all users if request user is authenticated with a valid token', async () => {

      const aUser = await chai.request(HOST).post(`${PATH}`).send(brenda).then(parseBody)
      const loggedInUserResponse = await chai.request(HOST).post(`/api/v1/session`).send({
        email: brenda.email,
        password: brenda.password
      })
      const loggedInUser = parseBody(loggedInUserResponse)

      const allUsersResponse = await chai.request(HOST).get(`${PATH}`).set('X-Token', loggedInUser.token)
      allUsersResponse.status.should.eql(200);
      allUsersResponse.type.should.eql("application/json");
      const allUsers = parseBody(allUsersResponse).getEmbeds('users')
      allUsers.should.have.length(2)
    })
    it('does not return a list of all users if request user is not authenticated', async () => {
      try {
        await chai.request(HOST).get(`${PATH}`).set('X-Token', 'bla bla bla')
      }
      catch (error) {
        error.should.have.property('status').with.valueOf('500');
      }

    })
  })

  describe(`GET ${PATH}/:id`, () => {
    it("should return a single user", async () => {
      const credentials = await loggedInUserTokenAndId()
      const retrievedUserDetails = await chai.request(HOST).get(`${PATH}/${credentials.id}`).set('X-Token', credentials.token);
      retrievedUserDetails.should.have.property('status').with.valueOf('200');
      retrievedUserDetails.headers.should.have.property('content-type').with.valueOf('application/json');
      retrievedUserDetails.body.content.should.include.keys("id", "email", "first_name", "last_name");
    });
    it("should return an error when the requested user does not match the user in session", async () => {
      const credentials = await loggedInUserTokenAndId()
      try {
        await chai.request(HOST).get(`${PATH}/999`).set('X-Token', credentials.token);
      } catch (error) {
        error.status.should.eql(403);
        error.response.body.content.should.eql('Unauthorised Request');
      }
    });
  });

});
