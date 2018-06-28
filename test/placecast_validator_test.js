import {expect} from 'chai'
import {validatePlacecast} from '../server/placecasts/placecastValidator'
import {buildPlacecast} from "./helpers/builders";

describe('placecastValidator', () => {

  it('returns valid if lat long are valid', () => {
    const placecast = buildPlacecast({});

    const isValid = validatePlacecast(placecast)
    expect(isValid).to.be.true
  })

  it('returns invalid if lat long are invalid', () => {
    const placecast = buildPlacecast({
      coordinates: [ -200.187682, 500.472303 ]
    });
    const isValid = validatePlacecast(placecast)

    expect(isValid).to.not.be.true
    expect(isValid.coordinates[0].violation).to.deep.eql({ value: 'must_be_valid_coordinates' })
  })

  it('returns invalid if title is blank', () => {
    const placecast = buildPlacecast({title: ""});
    const isValid = validatePlacecast(placecast)

    expect(isValid).to.not.be.true
  })

  it('returns invalid if subtitle is blank', () => {
    const placecast = buildPlacecast({ subtitle: ""});
    const isValid = validatePlacecast(placecast)

    expect(isValid).to.not.be.true
  })

  it('returns invalid if s3 audio filename is missing', () => {
    const placecast = buildPlacecast({ s3_audio_filename: "    "});
    const isValid = validatePlacecast(placecast)

    expect(isValid).to.not.be.true
  })

  it('returns invalid if user_id is missing', () => {
    const placecast = buildPlacecast({ user_id: "    "});

    const isValid = validatePlacecast(placecast)

    expect(isValid).to.not.be.true
  })

  it('returns invalid if user_id is not an integer', () => {
    const placecast = buildPlacecast({ user_id: "brenda"});

    const isValid = validatePlacecast(placecast)

    expect(isValid).to.not.be.true
    expect(isValid.user_id[0].violation).to.deep.eql({ value: 'must_be_an_integer' })
  })

  it('returns invalid if coords are not an object', () => {
    const placecast = buildPlacecast({
      coordinates: "-0.187682, 51.472303"
    });

    const isValid = validatePlacecast(placecast)
    expect(isValid).to.not.be.true
    expect(isValid.coordinates[0].violation).to.deep.eql({ value: 'must_be_a_pair_of_coordinates' })
  })

  it('returns invalid if coords are not a pair of coordinates', () => {
    const placecast = buildPlacecast({coordinates: [0.187682]});

    const isValid = validatePlacecast(placecast)
    expect(isValid).to.not.be.true
    expect(isValid.coordinates[0].violation).to.deep.eql({ value: 'must_be_a_pair_of_coordinates' })
  })

})
