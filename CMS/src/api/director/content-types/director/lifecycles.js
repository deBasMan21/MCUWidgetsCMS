module.exports = {
  afterCreate(event) {
    createDirector(event)
  },
  afterUpdate(event) {
    createDirector(event)
  },
  afterDelete(event) {
    deleteDirector(event)
  }
};

async function createDirector(event) {
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

  console.log(director)
  try {
    const fetch = require('node-fetch')

    const result = await fetch(`http://mcu-widgets-recommendations-api:3000/api/director`, {
      method: 'post',
      body: JSON.stringify(director),
      headers: { 'Content-Type': 'application/json' }
    })

    console.log(result)
  } catch (error) {
    console.log(error)
  }
}

async function deleteDirector(event) {
  const { result } = event
  const { id } = result

  console.log(id)
  try {
    const fetch = require('node-fetch')

    const result = await fetch(`http://mcu-widgets-recommendations-api:3000/api/director/${id}`, { method: 'delete' })

    console.log(result)
  } catch (error) {
    console.log(error)
  }
}
