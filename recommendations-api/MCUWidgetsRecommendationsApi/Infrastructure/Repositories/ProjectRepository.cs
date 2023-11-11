using System;
using MCUWidgetsRecommendationsApi.Infrastructure.Context;
using MCUWidgetsRecommendationsApi.Infrastructure.Interfaces;
using MCUWidgetsRecommendationsApi.Models;

namespace MCUWidgetsRecommendationsApi.Infrastructure.Repositories
{
	public class ProjectRepository: IProjectRepository
	{
        private readonly GeneralDbContext _context;

		public ProjectRepository(GeneralDbContext context)
		{
            _context = context;
		}

        public async Task Create(Project project)
        {
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int projectId)
        {
            Project? project = _context.Projects.FirstOrDefault(p => p.id == projectId);
            if (project == null) { return; }

            _context.Remove(project);
            await _context.SaveChangesAsync();
        }

        public async Task Update(Project project)
        {
            Project? oldProject = _context.Projects.FirstOrDefault(p => p.id == project.id);
            if (oldProject == null) { return; }

            oldProject.imdb_id = project.imdb_id;
            oldProject.overview = project.overview;
            oldProject.pageType = project.pageType;
            oldProject.posterUrl = project.posterUrl;
            oldProject.releaseDate = project.releaseDate;
            oldProject.source = project.source;
            oldProject.title = project.title;
            oldProject.type = project.type;
            oldProject.categories = project.categories;

            _context.Update(oldProject);
            await _context.SaveChangesAsync();
        }
    }
}

