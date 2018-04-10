
writeHalJsonContent = response => json => {

  response.header('content-type', 'application/hal+json')
  response.header('Cache-Control', 'no-cache')

  if (json.content) {
    response.json(json.content)
  }
  response.end()
}

writeContent = (resource, response) => {
  this.writeHalJsonContent(response)(resource)
}

export const respondOk = response => resource => {
  response.status(200)

  return writeContent(resource, response)
}


export const respondNotFound = (response, code, message = null) => () => {
  response.status(404)
  return writeContent(resource, response)
}