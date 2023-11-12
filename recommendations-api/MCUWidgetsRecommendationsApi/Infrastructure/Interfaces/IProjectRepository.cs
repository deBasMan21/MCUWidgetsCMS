using System;
using MCUWidgetsRecommendationsApi.Models;

namespace MCUWidgetsRecommendationsApi.Infrastructure.Interfaces
{
	public interface IProjectRepository
	{
		public Task Create(Project project);
		public Task Update(Project project);
		public Task Delete(int projectId);
		public bool Exists(int projectId);
	}
}

