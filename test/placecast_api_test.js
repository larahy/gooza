import './spec_helper'
import { find } from 'lodash'
import halson from 'halson'
const port = process.env.PORT || 8081;
const HOST = `http://localhost:${port}`;
const PATH = "/api/v1/placecasts";

const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const buildPlacecast = ({
  title = 'Twinings Tea Shop',
  subtitle = 'The Twinings logo, a simple, gold sign bearing the company name, has remained unchanged since 1787.',
  coordinates = [-0.187682, 51.472303],
  s3_audio_filename = 'twinings_tea.mp3'
} = {}) => {
  return {
    title,
    subtitle,
    coordinates,
    s3_audio_filename
  }
}

const parseBody = response => halson(response.body.content)
const TwiningsTeaShopJson = buildPlacecast({})

const anotherPlacecastJson = buildPlacecast({
    title: 'Potteries and Piggeries',
    s3_audio_filename: 'potteries_and_piggeries.mp3',
    subtitle: 'This kiln, built in about 1824, is all that is left of a slum that was once one of the worst places to live in London.',
    coordinates: [-0.2114, 51.5104]
  })

describe("routes: placecasts", () => {
  describe(`POST ${PATH}`, () => {
    it("should add a new placecast", async () => {
      const newPlacecast = await chai.request(HOST).post(`${PATH}`).send(TwiningsTeaShopJson);
      newPlacecast.status.should.eql(201);
      newPlacecast.should.have.header("location");
      newPlacecast.type.should.eql("application/json");
      newPlacecast.body.content.should.include.keys("id", "title", "geom", "s3_audio_filename", "subtitle");
    });
    it("does not add a new placecast if one already exists with that title", async () => {
      await chai.request(HOST).post(`${PATH}`).send(TwiningsTeaShopJson);
      try {
        await chai.request(HOST).post(`${PATH}`).send(TwiningsTeaShopJson)
      } catch (error) {
        error.should.have.property('status').with.valueOf('409');
        error.response.body.content.should.eql(`A placecast with that title already exists`);
      }
    });
    it("does not add a new placecast if placecast data is invalid", async () => {
      const invalidPlacecast = {
        title: "",
        subtitle: "",
        coordinates: [-0.187682, 51.472303],
        s3_audio_file: ""
      };
      try {
        await chai.request(HOST).post(`${PATH}`).send(invalidPlacecast)
      } catch (error) {
        error.should.have.property('status').with.valueOf('422');
        error.response.body.content.fields.should.deep.eql(['title','subtitle']);
        error.response.body.content.message.should.eql("Data missing or invalid");
      }
    });
  })

  describe(`GET ${PATH}`, () => {
    it('returns a list of all placecasts', async () => {

      const aPlacecast = await chai.request(HOST).post(`${PATH}`).send(TwiningsTeaShopJson).then(parseBody)
      await chai.request(HOST).post(`${PATH}`).send(anotherPlacecastJson).then(parseBody)

      const allPlacecastsResponse = await chai.request(HOST).get(`${PATH}`)

      const allPlacecasts = parseBody(allPlacecastsResponse).getEmbeds('placecasts')
      allPlacecastsResponse.status.should.eql(200);
      allPlacecastsResponse.type.should.eql("application/json");
      const firstPlacecast = find(allPlacecasts, [ 'id', aPlacecast.id ])

      firstPlacecast.title.should.equal(aPlacecast.title)
      firstPlacecast.subtitle.should.equal(aPlacecast.subtitle)
      firstPlacecast.s3_audio_filename.should.equal(aPlacecast.s3_audio_filename)
      firstPlacecast.geom.should.equal(aPlacecast.geom)
      firstPlacecast._links.should.deep.equal(aPlacecast._links)
    })
    it('returns a list of all placecasts with matching titles when they exist', async () => {
      const HamleysShopJson = buildPlacecast({
        title: 'Hamleys Toy Shop',
        s3_audio_filename: 'hamleys_toys.mp3'
      })
      const Twinings = await chai.request(HOST).post(`${PATH}`).send(TwiningsTeaShopJson).then(parseBody)
      const Hamleys = await chai.request(HOST).post(`${PATH}`).send(HamleysShopJson).then(parseBody)
      const allPlacecastsWithShopInTitleResponse = await chai.request(HOST).get(`${PATH}`).query({title: 'shop'})
      const allPlacecastsWithShopInTitle = parseBody(allPlacecastsWithShopInTitleResponse).getEmbeds('placecasts')
      allPlacecastsWithShopInTitleResponse.status.should.eql(200);
      allPlacecastsWithShopInTitleResponse.type.should.eql("application/json");
      allPlacecastsWithShopInTitle.length.should.eql(2)
      const TwiningsPlacecast = find(allPlacecastsWithShopInTitle, [ 'id', Twinings.id ])
      const HamleysPlacecast = find(allPlacecastsWithShopInTitle, [ 'id', Hamleys.id ])
      TwiningsPlacecast.title.should.equal(Twinings.title)
      HamleysPlacecast.title.should.equal(Hamleys.title)
    })
    it('returns no results when they do not exist', async () => {
      const allPlacecastsWithBrendaInTitleResponse = await chai.request(HOST).get(`${PATH}`).query({title: 'Brenda'})
      const allPlacecastsWithBrendaInTitle = parseBody(allPlacecastsWithBrendaInTitleResponse).getEmbeds('placecasts')
      allPlacecastsWithBrendaInTitleResponse.status.should.eql(200);
      allPlacecastsWithBrendaInTitleResponse.type.should.eql("application/json");
      allPlacecastsWithBrendaInTitle.length.should.eql(0)
    })
  })

  describe(`GET ${PATH}/:id`, () => {
    it("should return a single resource", async () => {
      const aPlacecast = await chai.request(HOST).get(`${PATH}/1`);
      aPlacecast.should.have.property('status').with.valueOf('200');
      aPlacecast.headers.should.have.property('content-type').with.valueOf('application/json');
      aPlacecast.body.content.should.include.keys("id", "title", "geom", "s3_audio_filename", "subtitle");
    });
    it("should return an error when the requested placecast does not exist", async () => {
      try {
        await chai.request(HOST).get(`${PATH}/999`)
      } catch (error) {
        error.should.have.property('status').with.valueOf('404');
        error.response.body.content.should.eql('The requested placecast does not exist');
      }
    });
  });

  describe(`GET ${PATH}/:id`, () => {
    it("should return a single resource", async () => {
      const aPlacecast = await chai.request(HOST).get(`${PATH}/1`);
      aPlacecast.should.have.property('status').with.valueOf('200');
      aPlacecast.headers.should.have.property('content-type').with.valueOf('application/json');
      aPlacecast.body.content.should.include.keys("id", "title", "geom", "s3_audio_filename", "subtitle");
    });
    it("should return an error when the requested placecast does not exist", async () => {
      try {
        await chai.request(HOST).get(`${PATH}/999`)
      } catch (error) {
        error.should.have.property('status').with.valueOf('404');
        error.response.body.content.should.eql('The requested placecast does not exist');
      }
    });
  });
});
