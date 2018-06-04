const NOT_FOUND = "NOT_FOUND";
const INVALID_DATA = "INVALID_DATA";
export const ErrorIs = {
  duplicatePlacecast: error => error.constraint === 'placecasts_title_unique',
  invalidPlacecast: error => error.code === INVALID_DATA,
  notFound: error => error.code === NOT_FOUND,
}

export class ValidationError extends Error {
  constructor (message, validationResult) {
    super(message)
    this.code = INVALID_DATA
    this.validationResult = validationResult
  }
}

export class NotFoundError extends Error {
  constructor (message) {
    super(message)
    this.code = NOT_FOUND
  }
}
