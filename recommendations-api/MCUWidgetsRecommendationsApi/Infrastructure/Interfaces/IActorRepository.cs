using System;
using MCUWidgetsRecommendationsApi.Models;

namespace MCUWidgetsRecommendationsApi.Infrastructure.Interfaces
{
	public interface IActorRepository
	{
        public Task Create(Actor actor);
        public Task Update(Actor actor);
        public Task Delete(int actorId);
    }
}

