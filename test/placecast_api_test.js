import './spec_helper'
import { find } from 'lodash'
import halson from 'halson'
const port = process.env.PORT || 8081;
const HOST = `http://localhost:${port}`;
const PATH = "/api/v1/placecasts";
import {buildPlacecast, buildUser} from "./helpers/builders";
import {loggedInUserTokenAndId} from "./helpers/sessions";

const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const parseBody = response => halson(response.body.content)

const anotherPlacecastJson = buildPlacecast({
    title: 'Potteries and Piggeries',
    s3_audio_filename: 'potteries_and_piggeries.mp3',
    s3_photo_filename: 'potteries_and_piggeries.jpeg',
    coordinates: [-0.2114, 51.5104],
  })

describe("routes: placecasts", () => {
  describe(`POST ${PATH}`, () => {
    it("should add a new placecast if the session user is the same as the placecast user", async () => {
      //
      const credentials = await loggedInUserTokenAndId()
      const TwiningsTeaShopJson = buildPlacecast({user_id: credentials.id })


      const newPlacecast = await chai.request(HOST).post(`${PATH}`).set('X-Token', credentials.token).send(TwiningsTeaShopJson);
      newPlacecast.status.should.eql(201);
      newPlacecast.should.have.header("location");
      newPlacecast.type.should.eql("application/json");
      newPlacecast.body.content.should.include.keys("id", "title", "geom", "s3_audio_filename", "subtitle", "user_id");
    });
    it("should add a new placecast if the session user is the same as the placecast user and said user's account is active", async () => {
      //
      const credentials = await loggedInUserTokenAndId()
      const TwiningsTeaShopJson = buildPlacecast({user_id: credentials.id })

      const newPlacecast = await chai.request(HOST).post(`${PATH}`).set('X-Token', credentials.token).send(TwiningsTeaShopJson);
      newPlacecast.status.should.eql(201);
      newPlacecast.should.have.header("location");
      newPlacecast.type.should.eql("application/json");
      newPlacecast.body.content.should.include.keys("id", "title", "geom", "s3_audio_filename", "subtitle", "user_id");
    });
    it("does not add a new placecast if one already exists with that title", async () => {
      const credentials = await loggedInUserTokenAndId()
      const TwiningsTeaShopJson = buildPlacecast({user_id: credentials.id })

      await chai.request(HOST).post(`${PATH}`).set('X-Token', credentials.token).send(TwiningsTeaShopJson);
      try {
        await chai.request(HOST).post(`${PATH}`).set('X-Token', credentials.token).send(TwiningsTeaShopJson);
      } catch (error) {
        error.should.have.property('status').with.valueOf('409');
        error.response.body.content.should.eql(`A placecast with that title already exists`);
      }
    });
    it("does not add a new placecast if placecast data is invalid", async () => {

      const credentials = await loggedInUserTokenAndId()
      const invalidPlacecastJson = buildPlacecast({title: "", subtitle: "", user_id: credentials.id })
      try {
        await chai.request(HOST).post(`${PATH}`).set('X-Token', credentials.token).send(invalidPlacecastJson)
      } catch (error) {
        error.should.have.property('status').with.valueOf('422');
        error.response.body.content.fields.should.deep.eql({ title: 'missing', subtitle: 'missing' });
        error.response.body.content.message.should.eql("Data missing or invalid");
      }
    });

    it("returns a meaningful error response when placecast data is invalid", async () => {

      const credentials = await loggedInUserTokenAndId()
      const invalidPlacecastJson = buildPlacecast({coordinates: "brenda", title: '', user_id: credentials.id })
      try {
        await chai.request(HOST).post(`${PATH}`).set('X-Token', credentials.token).send(invalidPlacecastJson)
      } catch (error) {
        error.should.have.property('status').with.valueOf('422');
        error.response.body.content.fields.should.deep.eql({ title: 'missing', coordinates: 'incorrect_format' });
        error.response.body.content.message.should.eql("Data missing or invalid");
      }
    });
    it('does not create placecast if the session user is not the same as the placecast user', async () => {
      const credentials = await loggedInUserTokenAndId()
      const TwiningsTeaShopJson = buildPlacecast({user_id: 333})

      try {
        await chai.request(HOST).post(`${PATH}`).set('X-Token', credentials.token).send(TwiningsTeaShopJson);
      } catch (error) {
        error.should.have.property('status').with.valueOf('403');
        error.response.body.content.should.eql('Unauthorised Request');
      }
    })
  })

  describe(`GET ${PATH}`, () => {
    it('returns a list of all placecasts', async () => {
      const credentials = await loggedInUserTokenAndId()
      const TwiningsTeaShopJson = buildPlacecast({user_id: credentials.id })
      const anotherPlacecastJson = buildPlacecast({user_id: credentials.id, title: 'Potteries and Piggeries', s3_audio_filename: 'potteries_and_piggeries.mp3', s3_photo_filename: 'potteries_and_piggeries.jpeg' })


      const aPlacecast = await chai.request(HOST).post(`${PATH}`).set('X-Token', credentials.token).send(TwiningsTeaShopJson).then(parseBody)
      await chai.request(HOST).post(`${PATH}`).set('X-Token', credentials.token).send(anotherPlacecastJson).then(parseBody)

      const allPlacecastsResponse = await chai.request(HOST).get(`${PATH}`)

      const allPlacecasts = parseBody(allPlacecastsResponse).getEmbeds('placecasts')
      allPlacecastsResponse.status.should.eql(200);
      allPlacecastsResponse.type.should.eql("application/json");
      const firstPlacecast = find(allPlacecasts, [ 'id', aPlacecast.id ])

      firstPlacecast.title.should.equal(aPlacecast.title)
      firstPlacecast.subtitle.should.equal(aPlacecast.subtitle)
      firstPlacecast.s3_audio_filename.should.equal(aPlacecast.s3_audio_filename)
      firstPlacecast.s3_photo_filename.should.equal(aPlacecast.s3_photo_filename)
      firstPlacecast.geom.should.equal(aPlacecast.geom)
      firstPlacecast._links.should.deep.equal(aPlacecast._links)
    })
    it('returns a list of all placecasts with matching titles when they exist', async () => {

      const credentials = await loggedInUserTokenAndId()
      const TwiningsTeaShopJson = buildPlacecast({user_id: credentials.id })
      const anotherPlacecastJson = buildPlacecast({user_id: credentials.id, title: 'Hamleys Toy Shop', s3_audio_filename: 'hamleys_toys.mp3', s3_photo_filename: 'hamleys_toys.jpeg'})


      const Twinings = await chai.request(HOST).post(`${PATH}`).set('X-Token', credentials.token).send(TwiningsTeaShopJson).then(parseBody)
      const Hamleys = await chai.request(HOST).post(`${PATH}`).set('X-Token', credentials.token).send(anotherPlacecastJson).then(parseBody)

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
    it('returns a list of all placecasts within a specified radius of a point when they exist', async () => {

      const credentials = await loggedInUserTokenAndId()
      const TwiningsTeaShopJson = buildPlacecast({user_id: credentials.id })

      // St Clement Danes is next door to Twinings Tea Shop
      const StClementDanesJson = buildPlacecast({
        user_id: credentials.id,
        title: 'St Clement Danes',
        s3_audio_filename: 'st_clement_danes.mp3',
        s3_photo_filename: 'st_clement_danes.jpeg',
        coordinates: [-0.113898, 51.513107 ]})


      const Twinings = await chai.request(HOST).post(`${PATH}`).set('X-Token', credentials.token).send(TwiningsTeaShopJson).then(parseBody)
      const StClementDanes = await chai.request(HOST).post(`${PATH}`).set('X-Token', credentials.token).send(StClementDanesJson).then(parseBody)
      const long = -0.1132
      const lat = 51.5137
      const radius = 1000;

      const allPlacecastsWithin1kmResponse = await chai.request(HOST).get(`${PATH}`).query({lat, long, radius})
      const allPlacecastsWithin1km = parseBody(allPlacecastsWithin1kmResponse).getEmbeds('placecasts')
      allPlacecastsWithin1kmResponse.status.should.eql(200);
      allPlacecastsWithin1kmResponse.type.should.eql("application/json");
      allPlacecastsWithin1km.length.should.eql(2)
      const TwiningsPlacecast = find(allPlacecastsWithin1km, [ 'id', Twinings.id ])
      const StClementDanesPlacecast = find(allPlacecastsWithin1km, [ 'id', StClementDanes.id ])
      TwiningsPlacecast.title.should.equal(Twinings.title)
      StClementDanesPlacecast.title.should.equal(StClementDanes.title)
    })
    it('returns no results when there are no placecasts within the specified radius do not exist', async () => {
      //coordinates for town in the outback of Australia
      const long = 118.4913
      const lat = -30.5672

      const radius = 20000;
      const allPlacecastsWithin200kmsOfOutbackResponse = await chai.request(HOST).get(`${PATH}`).query({lat,long,radius})
      const allPlacecastsWithin200kmsOfOutback = parseBody(allPlacecastsWithin200kmsOfOutbackResponse).getEmbeds('placecasts')
      allPlacecastsWithin200kmsOfOutbackResponse.status.should.eql(200);
      allPlacecastsWithin200kmsOfOutbackResponse.type.should.eql("application/json");
      allPlacecastsWithin200kmsOfOutback.length.should.eql(0)
    })
    it('returns a list of all placecasts within a specified radius of an address when they exist', async () => {

      const credentials = await loggedInUserTokenAndId()
      const TwiningsTeaShopJson = buildPlacecast({user_id: credentials.id })

      // St Clement Danes is next door to Twinings Tea Shop
      const StClementDanesJson = buildPlacecast({
        user_id: credentials.id,
        title: 'St Clement Danes',
        s3_audio_filename: 'st_clement_danes.mp3',
        s3_photo_filename: 'st_clement_danes.jpeg',
        coordinates: [-0.113898, 51.513107 ]})
      const Twinings = await chai.request(HOST).post(`${PATH}`).set('X-Token', credentials.token).send(TwiningsTeaShopJson).then(parseBody)
      const StClementDanes = await chai.request(HOST).post(`${PATH}`).set('X-Token', credentials.token).send(StClementDanesJson).then(parseBody)
      const address = 'St Clement Danes Church, Strand, London, UK'
      const radius = 1000;
      const allPlacecastsWithin1kmResponse = await chai.request(HOST).get(`${PATH}`).query({address, radius})
      const allPlacecastsWithin1km = parseBody(allPlacecastsWithin1kmResponse).getEmbeds('placecasts')
      allPlacecastsWithin1kmResponse.status.should.eql(200);
      allPlacecastsWithin1kmResponse.type.should.eql("application/json");
      allPlacecastsWithin1km.length.should.eql(2)
      const TwiningsPlacecast = find(allPlacecastsWithin1km, [ 'id', Twinings.id ])
      const StClementDanesPlacecast = find(allPlacecastsWithin1km, [ 'id', StClementDanes.id ])
      TwiningsPlacecast.title.should.equal(Twinings.title)
      StClementDanesPlacecast.title.should.equal(StClementDanes.title)
    })
  })

  describe(`GET ${PATH}/:id`, () => {
    it("should return a single resource", async () => {
      const credentials = await loggedInUserTokenAndId()
      const TwiningsTeaShopJson = buildPlacecast({user_id: credentials.id })
      const aPlacecast = await chai.request(HOST).post(`${PATH}`).set('X-Token', credentials.token).send(TwiningsTeaShopJson).then(parseBody)
      const retrievedPlacecast = await chai.request(HOST).get(`${PATH}/${aPlacecast.id}`);
      retrievedPlacecast.should.have.property('status').with.valueOf('200');
      retrievedPlacecast.headers.should.have.property('content-type').with.valueOf('application/json');
      retrievedPlacecast.body.content.should.include.keys("id", "title", "geom", "s3_audio_filename", "s3_photo_filename", "subtitle");
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

  describe(`PUT ${PATH}/:id`, () => {

    it("should only update a resource when the session user is the same as the placecast user", async () => {
      const credentials = await loggedInUserTokenAndId()
      const updatesJson = buildPlacecast({
        title: 'Catdog party shop',
        s3_audio_filename: 'catdog.mp3',
        s3_photo_filename: 'catdog.jpeg',
        user_id: credentials.id
      })
      const TwiningsTeaShopJson = buildPlacecast({user_id: credentials.id })
      const aPlacecast = await chai.request(HOST).post(`${PATH}`).set('X-Token', credentials.token).send(TwiningsTeaShopJson).then(parseBody)
      const updatedPlacecastResponse = await chai.request(HOST).put(`${PATH}/${aPlacecast.id}`).set('X-Token', credentials.token).send(updatesJson)
      const updatedPlacecast = parseBody(updatedPlacecastResponse)
      updatedPlacecastResponse.status.should.eql(200);
      updatedPlacecast.title.should.equal('Catdog party shop')
      updatedPlacecast.s3_audio_filename.should.equal('catdog.mp3')
      updatedPlacecast.s3_photo_filename.should.equal('catdog.jpeg')
    });
    it("should return an error when the  placecast to update does not exist", async () => {
      const credentials = await loggedInUserTokenAndId()
      const updatesJson = buildPlacecast({
        title: 'Catdog party shop',
        s3_audio_filename: 'catdog.mp3',
        user_id: credentials.id
      })
      try {
        await chai.request(HOST).put(`${PATH}/999`).set('X-Token', credentials.token).send(updatesJson)
      } catch (error) {
        error.should.have.property('status').with.valueOf('404');
        error.response.body.content.should.eql('The requested placecast does not exist');
      }
    });
    it("does not update a placecast if placecast data is invalid", async () => {
      const credentials = await loggedInUserTokenAndId()
      const invalidPlacecastJson = {
        title: "",
        subtitle: "",
        coordinates: [-0.187682, 51.472303],
        s3_audio_file: "",
        s3_photo_file: "",
        user_id: credentials.id
      };
      try {
        await chai.request(HOST).put(`${PATH}/1`).set('X-Token', credentials.token).send(invalidPlacecastJson)
      } catch (error) {
        error.should.have.property('status').with.valueOf('422');
        error.response.body.content.fields.should.deep.eql({ title: 'missing', subtitle: 'missing' });
        error.response.body.content.message.should.eql("Data missing or invalid");
      }
    });
  });

  describe(`DEL ${PATH}/:id`, () => {
    //TODO CHECK PLACECAST USER IS THE SAME AS TOKEN USER //
    it("should only delete a resource when the user is logged in", async () => {
      const credentials = await loggedInUserTokenAndId()
      const TwiningsTeaShopJson = buildPlacecast({user_id: credentials.id })
      const Twinings = await chai.request(HOST).post(`${PATH}`).set('X-Token', credentials.token).send(TwiningsTeaShopJson).then(parseBody)
      const deleteResponse = await chai.request(HOST).del(`${PATH}/${Twinings.id}`).set('X-Token', credentials.token)
      deleteResponse.should.have.property('status').with.valueOf('200');
      deleteResponse.body.should.eql({});
    });
    it.skip("should return an error when the requested placecast does not exist", async () => {
      try {
        await chai.request(HOST).del(`${PATH}/999`).set('X-Token', credentials.token);
      } catch (error) {
        error.should.have.property('status').with.valueOf('404');
        error.response.body.content.should.eql('The requested placecast does not exist');
      }
    });
  });
});
