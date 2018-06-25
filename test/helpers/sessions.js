const port = process.env.PORT || 8081;
const HOST = `http://localhost:${port}`;
import {buildUser} from "./builders";
import halson from 'halson'

const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const parseBody = response => halson(response.body.content)

export async function loggedInUserTokenAndId () {
  const brenda = buildUser({})
  const createdUser = await chai.request(HOST).post(`/api/v1/users`).send(brenda).then(parseBody)
  const loggedInUserResponse = await chai.request(HOST).post(`/api/v1/session`).send({email: brenda.email, password: brenda.password})
  const loggedInUser = parseBody(loggedInUserResponse)

  return {token: loggedInUser.token, id: createdUser.id}
}
