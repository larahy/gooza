export const respondCreated = response => resource => {
  response.status(201)
  response.header('location', resource.location)

  return response.send(resource)
}





