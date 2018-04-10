import './spec_helper'
const port = process.env.PORT || 8081;
const HOST = `http://localhost:${port}`;
const PATH = "/api/v1/placecasts";

const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

describe("routes: placecasts", () => {
  describe(`POST ${PATH}`, () => {
    it("should create a new placecast", async () => {
      const newPlacecast = await chai.request(HOST).post(`${PATH}`).send({
        title: "  Twinings Tea Shop",
        subtitle: "The Twinings logo, a simple, gold sign bearing the company name, has remained unchanged since 1787, \n"+
        "making it the oldest corporate logo still in use. In 1837 Queen Victoria granted the company a royal warrant, a merit \n" +
        "which has given Twinings the honor of providing tea to the royal family ever since. ",
        lat: 51.5133,
        long: -0.1128,
        address: "216 Strand\n" +
        "London, England\n" +
        "United Kingdom"
      });
      newPlacecast.status.should.eql(201);
      // newLandmark.should.have.header("Location");
      newPlacecast.type.should.eql("application/json");
      newPlacecast.body.should.include.keys("id");
    });
  })
});