module.exports = {
  afterCreate(event) {
    createOrUpdateActor(event)
  },
  afterUpdate(event) {
    createOrUpdateActor(event)
  },
  afterDelete(event) {
    deleteActor(event)
  }
};

async function createOrUpdateActor(event) {
  const { result } = event
  const { id, FirstName, LastName, ImageUrl, DateOfBirth, Character, mcu_projects } = result

  let actor = {
    id: id,
    firstName: FirstName,
    lastName: LastName,
    dateOfBirth: DateOfBirth,
    imageUrl: ImageUrl,
    character: Character,
    projects: mcu_projects.map((project) => { return { id: project.id } })
  }

  const helpers = require('./../../../../helpers/rabbitMQHelper')
  await helpers.default.sendEvent(actor, 'UpdateActorEvent')
}

async function deleteActor(event) {
  const { result } = event
  const { id } = result

  const helpers = require('./../../../../helpers/rabbitMQHelper')
  await helpers.default.sendEvent({ id }, 'DeleteActorEvent')
}
