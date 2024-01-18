using System;
using MCUWidgetsRecommendationsApi.Infrastructure.Context;
using MCUWidgetsRecommendationsApi.Infrastructure.Interfaces;
using MCUWidgetsRecommendationsApi.Models;
using MCUWidgetsRecommendationsApi.Models.Enums;
using MCUWidgetsRecommendationsApi.Models.Tracking;
using Microsoft.EntityFrameworkCore;

namespace MCUWidgetsRecommendationsApi.Infrastructure.Repositories
{
    public class RecommendationsRepository : IRecommendationsRepository
    {
        private readonly GeneralDbContext _context;

        public RecommendationsRepository(GeneralDbContext context)
        {
            _context = context;
        }

        public List<RecommendedPage> GetMostPopularRecommendations(string userId, int page, int pageSize)
        {
            return _context.TrackingPageOpenEvents
                .Where(u => u.userId == userId)
                .GroupBy(u => new { u.pageId, u.pageType })
                .Select(u => new { u.Key.pageId, u.Key.pageType, count = u.Count() })
                .OrderByDescending(u => u.count)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList()
                .Select(item =>
                {
                    switch (item.pageType)
                    {
                        case ClickPageType.PROJECT:
                            Project? proj = _context.Projects.FirstOrDefault(u => u.id == item.pageId);
                            if (proj == null)
                            {
                                return null;
                            }
                            return new RecommendedPage(proj.id, proj.title, proj.overview, proj.posterUrl, ClickPageType.PROJECT);
                        case ClickPageType.ACTOR:
                            Actor? actor = _context.Actors.FirstOrDefault(u => u.id == item.pageId);
                            if (actor == null)
                            {
                                return null;
                            }
                            return new RecommendedPage(actor.id, $"{actor.firstName} {actor.lastName}", $"This actor plays the role of {actor.character}", actor.imageUrl, ClickPageType.ACTOR);
                        case ClickPageType.DIRECTOR:
                            Director? director = _context.Directors.FirstOrDefault(u => u.id == item.pageId);
                            if (director == null)
                            {
                                return null;
                            }
                            return new RecommendedPage(director.id, $"{director.firstName} {director.lastName}", $"This director is born on {director.dateOfBirth:d MMMM yyyy}", director.imageUrl, ClickPageType.DIRECTOR);
                    }
                    return null;
                }).OfType<RecommendedPage>()
                .ToList();
        }
    }

    public class RecommendedPage
    {
        public int id { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string imageUrl { get; set; }
        public ClickPageType pageType { get; set; }

        public RecommendedPage(int id, string title, string description, string imageUrl, ClickPageType pageType)
        {
            this.id = id;
            this.title = title;
            this.description = description;
            this.imageUrl = imageUrl;
            this.pageType = pageType;
        }
    }
}