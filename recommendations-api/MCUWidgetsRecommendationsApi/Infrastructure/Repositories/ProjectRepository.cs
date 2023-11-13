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
            project.uniqueId = Guid.NewGuid().ToString();
            project.pageType = Models.Enums.ClickPageType.PROJECT;

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

            project.directors.ForEach(d =>
            {
                try
                {
                    _context.Attach(d);
                }
                catch (Exception e)
                {
                    Console.WriteLine($"Error occured while attaching director {d.id} to db: {e.Message}");
                }
            });
            project.actors.ForEach(a =>
            {
                try
                {
                    _context.Attach(a);
                }
                catch (Exception e)
                {
                    Console.WriteLine($"Error occured while attaching actor {a.id} to db: {e.Message}");
                }
            });

            oldProject.imdb_id = project.imdb_id;
            oldProject.overview = project.overview;
            oldProject.pageType = project.pageType;
            oldProject.posterUrl = project.posterUrl;
            oldProject.releaseDate = project.releaseDate;
            oldProject.source = project.source;
            oldProject.title = project.title;
            oldProject.type = project.type;
            oldProject.categories = project.categories;
            oldProject.actors = project.actors;
            oldProject.directors = project.directors;

            await _context.SaveChangesAsync();
        }

        public bool Exists(int projectId)
        {
            return _context.Projects.Any(p => p.id == projectId);
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