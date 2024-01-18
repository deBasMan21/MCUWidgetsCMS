using System;
using System.Numerics;
using MCUWidgetsRecommendationsApi.Infrastructure.Context;
using MCUWidgetsRecommendationsApi.Infrastructure.Interfaces;
using MCUWidgetsRecommendationsApi.Models;
using Microsoft.EntityFrameworkCore;

namespace MCUWidgetsRecommendationsApi.Infrastructure.Repositories
{
    public class DirectorRepository : IDirectorRepository
    {
        private readonly GeneralDbContext _context;

        public DirectorRepository(GeneralDbContext context)
        {
            _context = context;
        }

        public async Task Create(Director director)
        {
            director.pageType = Models.Enums.ClickPageType.DIRECTOR;
            director.projects = GetProjects(director.projects);

            _context.Directors.Add(director);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int directorId)
        {
            Director? director = _context.Directors.FirstOrDefault(d => d.id == directorId);
            if (director == null) { return; }

            _context.Directors.Remove(director);
            await _context.SaveChangesAsync();
        }

        public async Task Update(Director director)
        {
            Director? oldDirector = _context.Directors
                .Include(d => d.projects)
                .FirstOrDefault(d => d.id == director.id);
            if (oldDirector == null) { return; }

            oldDirector.firstName = director.firstName;
            oldDirector.lastName = director.lastName;
            oldDirector.dateOfBirth = director.dateOfBirth;
            oldDirector.imageUrl = director.imageUrl;
            oldDirector.pageType = director.pageType;
            oldDirector.projects = GetProjects(director.projects);

            _context.Directors.Update(oldDirector);
            await _context.SaveChangesAsync();
        }

        public bool Exists(int directorId)
        {
            return _context.Directors.Any(d => d.id == directorId);
        }

        private List<Project> GetProjects(List<Project> projects)
        {
            return _context.Projects
                .Where(p => projects
                    .Select(project => project.id)
                    .Contains(p.id)
                ).ToList();
        }
    }
}

