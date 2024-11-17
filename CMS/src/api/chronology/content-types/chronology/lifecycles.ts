export default {
  afterUpdate(event) {
    const { result } = event;
    const projects = result.mcu_projects;

    projects?.forEach((project) => {
        strapi.documents('api::mcu-project.mcu-project').update({
            documentId: project.id,
            data: {
                chronology: projects.indexOf(project)
            }
        })
    });
  },
};
