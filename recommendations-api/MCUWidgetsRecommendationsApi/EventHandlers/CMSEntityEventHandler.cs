using System;
using Infrastructure;
using MCUWidgetsRecommendationsApi.EventHandlers.Events;
using MCUWidgetsRecommendationsApi.Infrastructure.Interfaces;
using MCUWidgetsRecommendationsApi.Models;
using Newtonsoft.Json.Linq;

namespace MCUWidgetsRecommendationsApi.EventHandlers
{
	public class CMSEntityEventHandler: IHostedService, IMessageHandlerCallback
    {
        private readonly IMessageHandler _messageHandler;
        private readonly IProjectRepository _projectRepository;

        public CMSEntityEventHandler(
            IMessageHandler messageHandler,
            IProjectRepository projectRepository
        ) {
            this._messageHandler = messageHandler;
            this._projectRepository = projectRepository;
		}

        public async Task<bool> HandleMessageAsync(string messageType, string message)
        {
            Console.WriteLine($"Received event {messageType}");

            try
            {
                JObject messageObject = MessageSerializer.Deserialize(message);
                switch (messageType)
                {
                    case "CreateProjectEvent":
                        Project? createProjectEvent = messageObject.ToObject<Project>();
                        if (createProjectEvent == null) { return false; }

                        await _projectRepository.Create(createProjectEvent);
                        break;

                    case "UpdateProjectEvent":
                        Project? updateProjectEvent = messageObject.ToObject<Project>();
                        if (updateProjectEvent == null) { return false; }

                        await _projectRepository.Update(updateProjectEvent);
                        break;

                    case "DeleteProjectEvent":
                        DeleteProjectEvent? deleteProjectEvent = messageObject.ToObject<DeleteProjectEvent>();
                        if (deleteProjectEvent == null) { return false; }

                        await _projectRepository.Delete(deleteProjectEvent.id);
                        break;

                    default:
                        Console.WriteLine($"Event {messageType} not handled because there was no handler found.");
                        return false;
                }
            } catch (Exception e)
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

