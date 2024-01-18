using System;
using MCUWidgetsRecommendationsApi.Infrastructure.Context;
using MCUWidgetsRecommendationsApi.Infrastructure.Interfaces;
using MCUWidgetsRecommendationsApi.Models;
using Microsoft.EntityFrameworkCore;

namespace MCUWidgetsRecommendationsApi.Infrastructure.Repositories
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly GeneralDbContext _context;

        public ProjectRepository(GeneralDbContext context)
        {
            _context = context;
        }

        public async Task Create(Project project)
        {
            project.pageType = Models.Enums.ClickPageType.PROJECT;

            project.actors = GetActors(project.actors);
            project.directors = GetDirectors(project.directors);

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
            Project? oldProject = _context.Projects
                .Include(p => p.actors)
                .Include(p => p.directors)
                .FirstOrDefault(p => p.id == project.id);
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
            oldProject.actors = GetActors(project.actors);
            oldProject.directors = GetDirectors(project.directors);

            await _context.SaveChangesAsync();
        }

        public void DetachAllEntries()
        {
            _context.ChangeTracker.Clear();
        }

        public bool Exists(int projectId)
        {
            return _context.Projects.Any(p => p.id == projectId);
        }

        private List<Actor> GetActors(List<Actor> actors)
        {
            return _context.Actors
                .Where(a => actors
                    .Select(actor => actor.id)
                    .Contains(a.id)
                ).ToList();
        }

        private List<Director> GetDirectors(List<Director> directors)
        {
            return _context.Directors
                .Where(d => directors
                    .Select(director => director.id)
                    .Contains(d.id)
                ).ToList();
        }
    }

    static class Extensions
    {
        public static bool Exists<TContext, TEntity>(this TContext context, TEntity entity)
            where TContext : DbContext
            where TEntity : class, IIdentifiable
        {
            return context.Set<TEntity>().Local.Any(e => e.id == entity.id);
        }
    }
}