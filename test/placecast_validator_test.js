import {expect} from 'chai'
import {validatePlacecast} from '../server/placecasts/placecastValidator'

describe('placecastValidator', () => {

  it('returns valid if lat long are valid', () => {
    const placecast = {
      title: "Twinings Tea Shop",
      subtitle: "bla bla",
      coordinates: [ -0.187682, 51.472303 ],
      s3_audio_filename: "twinings_tea.mp3"
    };

    const isValid = validatePlacecast(placecast)
    expect(isValid).to.be.true
  })

  it('returns invalid if lat long are invalid', () => {
    const placecast = {
      title: "Twinings Tea Shop",
      subtitle: "bla bla",
      coordinates: [ -200.187682, 500.472303 ],
      s3_audio_filename: "twinings_tea.mp3"
    };
    const isValid = validatePlacecast(placecast)

    expect(isValid).to.not.be.true
    expect(isValid.coordinates[0].violation).to.deep.eql({ value: 'must_be_valid_coordinates' })
  })

  it('returns invalid if title is blank', () => {
    const placecast = {
      title: "",
      subtitle: "bla bla",
      coordinates: [ -0.187682, 51.472303 ],
      s3_audio_filename: "twinings_tea.mp3"
    };

    const isValid = validatePlacecast(placecast)

    expect(isValid).to.not.be.true
  })

  it('returns invalid if subtitle is blank', () => {
    const placecast = {
      title: "brenda",
      subtitle: "",
      coordinates: [ -0.187682, 51.472303 ],
      s3_audio_filename: "twinings_tea.mp3"
    };

    const isValid = validatePlacecast(placecast)

    expect(isValid).to.not.be.true
  })

  it('returns invalid if s3 audio filename is missing', () => {
    const placecast = {
      title: "Twinings Tea Shop",
      subtitle: "bla bla",
      coordinates: [ -0.187682, 51.472303 ],
      s3_audio_filename: "    "
    };

    const isValid = validatePlacecast(placecast)

    expect(isValid).to.not.be.true
  })

  it('returns invalid if coords are not an object', () => {
    const placecast = {
      title: "brenda",
      subtitle: "",
      coordinates: "-0.187682, 51.472303",
      s3_audio_filename: "twinings_tea.mp3"
    };

    const isValid = validatePlacecast(placecast)
    expect(isValid).to.not.be.true
    expect(isValid.coordinates[0].violation).to.deep.eql({ value: 'must_be_a_pair_of_coordinates' })
  })

  it('returns invalid if coords are not a pair of coordinates', () => {
    const placecast = {
      title: "brenda",
      subtitle: "",
      coordinates: [0.187682],
      s3_audio_filename: "twinings_tea.mp3"
    };

    const isValid = validatePlacecast(placecast)
    expect(isValid).to.not.be.true
    expect(isValid.coordinates[0].violation).to.deep.eql({ value: 'must_be_a_pair_of_coordinates' })
  })

})
