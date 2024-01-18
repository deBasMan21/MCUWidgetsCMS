using System;
using MCUWidgetsRecommendationsApi.Infrastructure.Repositories;
using MCUWidgetsRecommendationsApi.Models;
using MCUWidgetsRecommendationsApi.Models.Tracking;

namespace MCUWidgetsRecommendationsApi.Infrastructure.Interfaces
{
    public interface IRecommendationsRepository
    {
        public List<RecommendedPage> GetMostPopularRecommendations(string userId, int page, int pageSize);
    }
}