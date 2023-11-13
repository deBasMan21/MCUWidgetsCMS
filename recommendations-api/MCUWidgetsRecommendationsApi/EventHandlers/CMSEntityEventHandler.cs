using System;
using Infrastructure;
using MCUWidgetsRecommendationsApi.EventHandlers.Events;
using MCUWidgetsRecommendationsApi.Infrastructure.Interfaces;
using MCUWidgetsRecommendationsApi.Models;
using Newtonsoft.Json.Linq;

namespace MCUWidgetsRecommendationsApi.EventHandlers
{
    public class CMSEntityEventHandler : IHostedService, IMessageHandlerCallback
    {
        private readonly IMessageHandler _messageHandler;
        private readonly IProjectRepository _projectRepository;
        private readonly IActorRepository _actorRepository;
        private readonly IDirectorRepository _directorRepository;

        public CMSEntityEventHandler(
            IMessageHandler messageHandler,
            IProjectRepository projectRepository,
            IActorRepository actorRepository,
            IDirectorRepository directorRepository
        )
        {
            this._messageHandler = messageHandler;
            this._projectRepository = projectRepository;
            this._actorRepository = actorRepository;
            this._directorRepository = directorRepository;
        }

        public async Task<bool> HandleMessageAsync(string messageType, string message)
        {
            Console.WriteLine($"Received event {messageType}");

            try
            {
                JObject messageObject = MessageSerializer.Deserialize(message);
                switch (messageType)
                {
                    // Project EVENTS
                    case "UpdateProjectEvent":
                        Project? updateProjectEvent = messageObject.ToObject<Project>();
                        if (updateProjectEvent == null) { return false; }

                        bool projectExists = _projectRepository.Exists(updateProjectEvent.id);
                        if (projectExists)
                        {
                            await _projectRepository.Update(updateProjectEvent);
                        }
                        else
                        {
                            await _projectRepository.Create(updateProjectEvent);
                        }

                        break;

                    case "DeleteProjectEvent":
                        DeleteEvent? deleteProjectEvent = messageObject.ToObject<DeleteEvent>();
                        if (deleteProjectEvent == null) { return false; }

                        await _projectRepository.Delete(deleteProjectEvent.id);
                        break;

                    // ACTOR EVENTS
                    case "UpdateActorEvent":
                        Actor? updateActorEvent = messageObject.ToObject<Actor>();
                        if (updateActorEvent == null) { return false; }

                        bool actorExists = _actorRepository.Exists(updateActorEvent.id);
                        if (!actorExists)
                        {
                            await _actorRepository.Create(updateActorEvent);
                        }
                        else
                        {
                            await _actorRepository.Update(updateActorEvent);
                        }

                        break;

                    case "DeleteActorEvent":
                        DeleteEvent? deleteActorEvent = messageObject.ToObject<DeleteEvent>();
                        if (deleteActorEvent == null) { return false; }

                        await _actorRepository.Delete(deleteActorEvent.id);
                        break;

                    // DIRECTOR EVENTS
                    case "UpdateDirectorEvent":
                        Director? updateDirectorEvent = messageObject.ToObject<Director>();
                        if (updateDirectorEvent == null) { return false; }

                        bool directorExists = _directorRepository.Exists(updateDirectorEvent.id);
                        if (directorExists)
                        {
                            await _directorRepository.Update(updateDirectorEvent);
                        }
                        else
                        {
                            await _directorRepository.Create(updateDirectorEvent);
                        }

                        break;

                    case "DeleteDirectorEvent":
                        DeleteEvent? deleteDirectorEvent = messageObject.ToObject<DeleteEvent>();
                        if (deleteDirectorEvent == null) { return false; }

                        await _directorRepository.Delete(deleteDirectorEvent.id);
                        break;

                    // DEFAULT
                    default:
                        Console.WriteLine($"Event {messageType} not handled because there was no handler found.");
                        return false;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error while handling {messageType} event with message: {message}. Errormessage: {e.Message}");
                return false;
            }

            Console.WriteLine($"Succesfully handled event {messageType}");

            return true;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _messageHandler.Start(this);
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _messageHandler.Stop();
            return Task.CompletedTask;
        }
    }
}

