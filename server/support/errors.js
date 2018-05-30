export const ErrorIs = {
  duplicatePlacecast: error => error.constraint === 'placecasts_title_unique',
  invalidPlacecast: error => error.code === "INVALID_DATA",
}

export class ValidationError extends Error {
  constructor (message, validationResult) {
    super(message)
    this.code = "INVALID_DATA"
    this.validationResult = validationResult
  }
}
