export const respondCreated = response => resource => {
  response.status(201)
  response.header('location', resource.location)

  return response.send(resource)
}

export const respondOk = response => resource => {
  response.status(200)
  return response.send(resource)
}

export const respondNotFound = response => errorMessage => {
  return response.send(404, {type: 'halJson', content: errorMessage})
}

export const respondBadRequest = (response, code, message = null) => () => {
  response.status(400)

  return writeContent({
    type: 'halJson',
    content: formattedErrorContent(
      'not found',
      message,
      code
    )
  }, response)
}

export const respondConflict = response => errorMessage => {
  return response.send(409, {type: 'halJson', content: errorMessage})
}

export const respondInvalid = response => error =>  {
  return response.send(422, {type: 'halJson', content: {message: error.message, fields: error.validationResult}})
}

export const respondInternalServerError = response => () => {
  return response.send(500, {type: 'halJson', content: 'The server encountered an internal error. Please retry your request.'})
}


export const respondForbidden = response => () => {
  return response.send(403, {type: 'halJson', content: "Unauthorised Request"})
}



