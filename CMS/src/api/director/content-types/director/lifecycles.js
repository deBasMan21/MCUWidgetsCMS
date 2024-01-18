module.exports = {
  afterCreate(event) {
    createOrUpdateDirector(event)
  },
  afterUpdate(event) {
    createOrUpdateDirector(event)
  },
  afterDelete(event) {
    deleteDirector(event)
  }
};

async function createOrUpdateDirector(event) {
  const { result } = event
  const { id, FirstName, LastName, ImageUrl, DateOfBirth, mcu_projects } = result

  let director = {
    id: id,
    firstName: FirstName,
    lastName: LastName,
    dateOfBirth: DateOfBirth,
    imageUrl: ImageUrl,
    projects: mcu_projects.map((project) => { return { id: project.id } })
  }

  const helpers = require('./../../../../helpers/rabbitMQHelper')
  await helpers.default.sendEvent(director, 'UpdateDirectorEvent')
}

async function deleteDirector(event) {
  const { result } = event
  const { id } = result

  const helpers = require('./../../../../helpers/rabbitMQHelper')
  await helpers.default.sendEvent({ id }, 'DeleteDirectorEvent')
}
