using System;
using MCUWidgetsRecommendationsApi.Infrastructure.Context;
using MCUWidgetsRecommendationsApi.Infrastructure.Interfaces;
using MCUWidgetsRecommendationsApi.Models;
using Microsoft.EntityFrameworkCore;

namespace MCUWidgetsRecommendationsApi.Infrastructure.Repositories
{
    public class ActorRepository : IActorRepository
    {
        private readonly GeneralDbContext _context;

        public ActorRepository(GeneralDbContext context)
        {
            _context = context;
        }

        public async Task Create(Actor actor)
        {
            actor.pageType = Models.Enums.ClickPageType.ACTOR;
            actor.projects = GetProjects(actor.projects);

            _context.Actors.Add(actor);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int actorId)
        {
            Actor? actor = _context.Actors.FirstOrDefault(a => a.id == actorId);
            if (actor == null) { return; }

            _context.Actors.Remove(actor);
            await _context.SaveChangesAsync();
        }

        public async Task Update(Actor actor)
        {
            Actor? oldActor = _context.Actors
                .Include(a => a.projects)
                .FirstOrDefault(a => a.id == actor.id);
            if (oldActor == null) { return; }

            oldActor.firstName = actor.firstName;
            oldActor.lastName = actor.lastName;
            oldActor.dateOfBirth = actor.dateOfBirth;
            oldActor.imageUrl = actor.imageUrl;
            oldActor.character = actor.character;
            oldActor.pageType = actor.pageType;
            oldActor.projects = GetProjects(actor.projects);

            _context.Actors.Update(oldActor);
            await _context.SaveChangesAsync();
        }

        public bool Exists(int actorId)
        {
            return _context.Actors.Any(a => a.id == actorId);
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

