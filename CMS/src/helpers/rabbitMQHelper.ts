import amqp from "amqplib"

export default {
  sendEvent: async (project, type: EventType) => {
    try {
      logEvent('Starting connection', type, project.id)

      const options = { credentials: amqp.credentials.plain(process.env.RABBITMQ_USER, process.env.RABBITMQ_PWD)}
      let connection = await amqp.connect('amqp://messageQueue', options)
      logEvent('Connection opened', type, project.id)

      let channel = await connection.createChannel()
      let queue = 'RecommendationsAPIQueue'
      channel.assertQueue(queue, { durable: true })
      logEvent("Queue exists", type, project.id)

      channel.sendToQueue(queue, Buffer.from(JSON.stringify(project)), { headers: { MessageType: type }})
      logEvent('Sent ' + JSON.stringify(project), type, project.id)

      setTimeout(function () {
        connection.close()
        logEvent('Closed connection', type, project.id)
      }, 500)
    } catch (error) {
      logEvent('Error sending event ' + error, type, project.id)
    }
  }
}

export enum EventType {
  UPDATE_ACTOR = "UpdateActorEvent",
  DELETE_ACTOR = "DeleteActorEvent",

  UPDATE_DIRECTOR = "UpdateDirectorEvent",
  DELETE_DIRECTOR = "DeleteDirectorEvent",

  UPDATE_PROJECT = "UpdateProjectEvent",
  DELETE_PROJECT = "DeleteProjectEvent"
}

function logEvent(message, eventType, projectId) {
  strapi.log.info("MESSAGEQUEUE: " + message + " for " + eventType + " project " + projectId)
}
