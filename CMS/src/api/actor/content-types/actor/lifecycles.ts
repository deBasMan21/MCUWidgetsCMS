import rabbitMQHelper, { EventType } from "../../../../helpers/rabbitMQHelper";

export default {
  afterCreate(event) {
    createOrUpdateActor(event);
  },
  afterUpdate(event) {
    createOrUpdateActor(event);
  },
  afterDelete(event) {
    deleteActor(event);
  },
};

async function createOrUpdateActor(event) {
  const { result } = event;
  const {
    id,
    FirstName,
    LastName,
    ImageUrl,
    DateOfBirth,
    Character,
    mcu_projects,
  } = result;

  let actor = {
    id: id,
    firstName: FirstName,
    lastName: LastName,
    dateOfBirth: DateOfBirth,
    imageUrl: ImageUrl,
    character: Character,
    projects:
      mcu_projects?.map((project) => {
        return { id: project.id };
      }) ?? [],
  };

  await rabbitMQHelper.sendEvent(actor, EventType.UPDATE_ACTOR);
}

async function deleteActor(event) {
  const { result } = event;
  const { id } = result;

  await rabbitMQHelper.sendEvent({ id }, EventType.DELETE_ACTOR);
}
