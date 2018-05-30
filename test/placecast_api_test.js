import './spec_helper'
const port = process.env.PORT || 8081;
const HOST = `http://localhost:${port}`;
const PATH = "/api/v1/placecasts";

const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const newPlacecastJson = {
  title: "Twinings Tea Shop",
  subtitle: "The Twinings logo, a simple, gold sign bearing the company name, has remained unchanged since 1787, \n"+
  "making it the oldest corporate logo still in use. In 1837 Queen Victoria granted the company a royal warrant, a merit \n" +
  "which has given Twinings the honor of providing tea to the royal family ever since. ",
  lat: 51.5133,
  long: -0.1128,
  s3_audio_file: "twinings_tea.mp3"
};

describe("routes: placecasts", () => {
  describe(`POST ${PATH}`, () => {
    it("should create a new placecast", async () => {
      const newPlacecast = await chai.request(HOST).post(`${PATH}`).send(newPlacecastJson);
      newPlacecast.status.should.eql(201);
      // newLandmark.should.have.header("Location");
      newPlacecast.type.should.eql("application/json");
      newPlacecast.body.should.include.keys("id");
    });
    it("does not create a new placecast if one already exists with that title", async () => {
      await chai.request(HOST).post(`${PATH}`).send(newPlacecastJson);
      try {
        await chai.request(HOST).post(`${PATH}`).send(newPlacecastJson)
      } catch (error) {
      error.should.have.property('status').with.valueOf('409');
      error.response.body.message.should.eql(`A placecast with this title already exists`);
      error.response.body.code.should.eql(`placecasts_title_unique`);
    }
    });
  })
});