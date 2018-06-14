import { chain } from 'lodash'


export const toPlacecast = record => {

  return chain(record)
    .mapValues()
    .value()
}

export const toPlacecasts = results => {
  return chain(results)
    .map(toPlacecast)
    .values()
    .value()
}

export const toUser = record => {

  return chain(record)
    .mapValues()
    .value()
}
