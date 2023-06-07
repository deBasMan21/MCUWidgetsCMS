module.exports = {
  afterUpdate(event) {
    const { result } = event
    const projects = result.mcu_projects

    projects.forEach((project) => {
      strapi.entityService.update('api::mcu-project.mcu-project', project.id, {
        data: {
          chronology: projects.indexOf(project)
        }
      })
    })
  }
}
