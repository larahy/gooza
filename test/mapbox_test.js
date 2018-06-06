import {filter} from 'lodash'
import Promise from 'bluebird'

const HOST = 'https://api.mapbox.com'
const chai = require('chai')
const should = chai.should()
import {expect} from 'chai'

const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const MapboxClient = require('mapbox')
const userName = "larahy";
const accessToken = process.env.MAPBOX_TOKEN;
const fs = require('fs');
const AWS = require('aws-sdk');
describe.skip('Mapbox api', () => {
  describe('uploads', () => {
    it('should upload file data to a tileset', async () => {

      const client = new MapboxClient(accessToken);
      const upload = await client.createUploadCredentials(function (err, credentials) {
        var s3 = new AWS.S3({
          accessKeyId: credentials.accessKeyId,
          secretAccessKey: credentials.secretAccessKey,
          sessionToken: credentials.sessionToken,
          region: 'us-east-1'
        });
        s3.putObject({
          Bucket: credentials.bucket,
          Key: credentials.key,
          Body: fs.createReadStream('test/test.geojson')
        }, function (err, resp) {
        });
      });
      const uploadResponse = await client.createUpload({
        tileset: ["larahy", 'mytileset'].join('.'),
        url: upload.entity.url,
        name: "brenda"
      })
      uploadResponse.status.should.eql(201);
      uploadResponse.entity.should.include.keys("id");
    })

    it('should delete test uploads', async () => {

      const client = new MapboxClient(accessToken);
      const allUploads = await client.listUploads();
      const uploads = allUploads.entity
      const brendas = filter(uploads, function (o) {
        return o.name === 'brenda';
      });

      await Promise.all(brendas.map(async brenda => {
        await client.deleteUpload(`${brenda.id}`)
      }));
      const finalUploads = await client.listUploads();
      const finalUploadsss = finalUploads.entity
      const finalbrendas = filter(finalUploadsss, function (o) {
        return o.name === 'brenda';
      });
      expect(finalbrendas).to.have.lengthOf.at.most(1);

    })

    it('should list all datasets', async () => {

      const client = new MapboxClient(accessToken);
      const allDatasets = await client.listDatasets(function (err, datasets) {
        return datasets;
      });
      allDatasets.status.should.eql(200);
      allDatasets.entity[0].should.include.keys(["id", "owner", "name", "bounds", "features", "created", "modified"]);
    })

    it('should list all features in a dataset', async () => {

      const client = new MapboxClient(accessToken);
      const allFeatures = await client.listFeatures('cjer888qr6tt12yo1uii7ijnd', {}, function (err, collection) {
        return collection
      });
      allFeatures.status.should.eql(200);
      allFeatures.entity.features[0].should.include.keys(["id", "geometry", "properties"]);
    })
    it('should return lat long for a given address', async () => {

      const client = new MapboxClient(accessToken);
      const latlong = await client.geocodeForward('35 Furness Road, London, sw6 2lj', {limit: 2}, function(err, res) {
        return res
      });
      latlong.status.should.eql(200);
      latlong.entity.features[0].geometry.should.include.keys(["type", "coordinates"]);
    })
    it('should return lat long for Twinings', async () => {

      const client = new MapboxClient(accessToken);
      const latlong = await client.geocodeForward('St Clement Danes Church, Strand, London, UK', {limit: 2}, function(err, res) {
        return res
      });
      console.log(latlong.entity.features)
      console.log(latlong.entity.features[0].geometry.coordinates)
      latlong.status.should.eql(200);
      latlong.entity.features[0].geometry.should.include.keys(["type", "coordinates"]);
    })
  })
})