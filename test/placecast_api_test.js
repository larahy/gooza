import './spec_helper'
import { find } from 'lodash'
const port = process.env.PORT || 8081;
const HOST = `http://localhost:${port}`;
const PATH = "/api/v1/placecasts";

const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const aPlacecastJson = {
  title: "Twinings Tea Shop",
  subtitle: "The Twinings logo, a simple, gold sign bearing the company name, has remained unchanged since 1787, \n" +
  "making it the oldest corporate logo still in use. In 1837 Queen Victoria granted the company a royal warrant, a merit \n" +
  "which has given Twinings the honor of providing tea to the royal family ever since. ",
  coordinates: [-0.187682, 51.472303],
  s3_audio_file: "twinings_tea.mp3"
};

const anotherPlacecastJson = {
  title: "Potteries and Piggeries",
  subtitle: "This kiln, built in about 1824, is all that is left of a slum that was once one of the worst places to live" +
  " in London. The area was called the Potteries and Piggeries, though even before that it was known as Cut-throat Lane. ",
  coordinates: [-0.2114, 51.5104],
  s3_audio_file: "potteries_and_piggeries.mp3"
};

describe("routes: placecasts", () => {
  describe(`POST ${PATH}`, () => {
    it("should add a new placecast", async () => {
      const newPlacecast = await chai.request(HOST).post(`${PATH}`).send(aPlacecastJson);
      newPlacecast.status.should.eql(201);
      // newLandmark.should.have.header("Location");
      newPlacecast.type.should.eql("application/json");
      newPlacecast.body.should.include.keys("id");
    });
    it("does not add a new placecast if one already exists with that title", async () => {
      await chai.request(HOST).post(`${PATH}`).send(aPlacecastJson);
      try {
        await chai.request(HOST).post(`${PATH}`).send(aPlacecastJson)
      } catch (error) {
        error.should.have.property('status').with.valueOf('409');
        error.response.body.message.should.eql(`A placecast with this title already exists`);
        error.response.body.code.should.eql(`placecasts_title_unique`);
      }
    });
    it("does not add a new placecast if placecast data is invalid", async () => {
      const invalidPlacecast = {
        title: "valid title",
        subtitle: "",
        coordinates: [-0.187682, 51.472303],
        s3_audio_file: ""
      };
      try {
        await chai.request(HOST).post(`${PATH}`).send(invalidPlacecast)
      } catch (error) {
        error.should.have.property('status').with.valueOf('400');
        error.response.body.code.should.eql("INVALID_DATA");
        error.response.body.message.should.eql("Data missing or invalid");
      }
    });
  })

  describe(`GET ${PATH}`, () => {
    it('returns a list of all placecasts', async () => {
      const parseBody = response => {
        return response.body
      }
      const aPlacecast = await chai.request(HOST).post(`${PATH}`).send(aPlacecastJson).then(parseBody)
      const anotherPlacecast = await chai.request(HOST).post(`${PATH}`).send(anotherPlacecastJson).then(parseBody)
      const allPlacecastsResponse = await chai.request(HOST).get(`${PATH}`)

      allPlacecastsResponse.status.should.eql(200);
      allPlacecastsResponse.type.should.eql("application/json");

      const allPlacecasts = await parseBody(allPlacecastsResponse);
      const firstPlacecast = find(allPlacecasts, [ 'id', aPlacecast.id ])
      const secondPlacecast = find(allPlacecasts, [ 'id', anotherPlacecast.id ])

      firstPlacecast.title.should.equal(aPlacecastJson.title)
      secondPlacecast.title.should.equal(anotherPlacecastJson.title)
    })


  })
});
