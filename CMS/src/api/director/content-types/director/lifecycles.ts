import rabbitMQHelper, { EventType } from "../../../../helpers/rabbitMQHelper";

export default {
  afterCreate(event) {
    createOrUpdateDirector(event);
  },
  afterUpdate(event) {
    createOrUpdateDirector(event);
  },
  afterDelete(event) {
    deleteDirector(event);
  },
};

async function createOrUpdateDirector(event) {
  const { result } = event;
  const { id, FirstName, LastName, ImageUrl, DateOfBirth, mcu_projects } =
    result;

  let director = {
    id: id,
    firstName: FirstName,
    lastName: LastName,
    dateOfBirth: DateOfBirth,
    imageUrl: ImageUrl,
    projects: mcu_projects?.map((project) => {
      return { id: project.id };
    }) ?? [],
  };

  await rabbitMQHelper.sendEvent(director, EventType.UPDATE_DIRECTOR);
}

async function deleteDirector(event) {
  const { result } = event;
  const { id } = result;

  await rabbitMQHelper.sendEvent({ id }, EventType.DELETE_DIRECTOR);
}
