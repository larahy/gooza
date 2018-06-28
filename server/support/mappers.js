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

export const toErrorMessage = results => {
  return chain(results)
    .mapValues(toViolation)
    .value()
}

export const toViolation = record => {
  if (record[0].violation === undefined) {
    return 'missing'
  }
  return record[0].violation
}

