import {expect} from 'chai'
import {validatePlacecast} from '../server/placecasts/placecastValidator'

describe('placecastValidator', () => {

  it('returns valid if lat long are valid', () => {
    const placecast = {
      title: "Twinings Tea Shop",
      subtitle: "bla bla",
      coordinates: [ -0.187682, 51.472303 ],
      s3_audio_file: "twinings_tea.mp3"
    };
    expect(validatePlacecast(placecast)).to.be.true
  })

  it('returns invalid if lat long are invalid', () => {
    const placecast = {
      title: "Twinings Tea Shop",
      subtitle: "bla bla",
      coordinates: [ -200.187682, 500.472303 ],
      s3_audio_file: "twinings_tea.mp3"
    };
    const isValid = validatePlacecast(placecast)

    expect(isValid).to.not.be.true
  })

  it('returns invalid if title is blank', () => {
    const placecast = {
      title: "",
      subtitle: "bla bla",
      coordinates: [ -0.187682, 51.472303 ],
      s3_audio_file: "twinings_tea.mp3"
    };

    const isValid = validatePlacecast(placecast)

    expect(isValid).to.not.be.true
  })

  it('returns invalid if subtitle is blank', () => {
    const placecast = {
      title: "brenda",
      subtitle: "",
      coordinates: [ -0.187682, 51.472303 ],
      s3_audio_file: "twinings_tea.mp3"
    };

    const isValid = validatePlacecast(placecast)

    expect(isValid).to.not.be.true
  })


})