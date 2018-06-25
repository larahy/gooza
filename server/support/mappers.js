import { chain } from 'lodash'


export const toRecord = record => {

  return chain(record)
    .mapValues()
    .value()
}

export const toRecords = results => {
  return chain(results)
    .map(toRecord)
    .values()
    .value()
}
