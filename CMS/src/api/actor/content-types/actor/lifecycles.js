module.exports = {
  afterCreate(event) {
    createActor(event)
  },
  afterUpdate(event) {
    createActor(event)
  },
  afterDelete(event) {
    deleteActor(event)
  }
};

async function createActor(event) {
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

  console.log(actor)
  try {
    const fetch = require('node-fetch')

    const result = await fetch(`http://mcu-widgets-recommendations-api:3000/api/actor`, {
      method: 'post',
      body: JSON.stringify(actor),
      headers: { 'Content-Type': 'application/json' }
    })

    console.log(result)
  } catch (error) {
    console.log(error)
  }
}

async function deleteActor(event) {
  const { result } = event
  const { id } = result

  console.log(id)
  try {
    const fetch = require('node-fetch')

    const result = await fetch(`http://mcu-widgets-recommendations-api:3000/api/actor/${id}`, { method: 'delete' })

    console.log(result)
  } catch (error) {
    console.log(error)
  }
}
