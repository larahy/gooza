export const ErrorIs = {
  duplicatePlacecast: error => error.constraint === 'placecasts_title_unique',
}
