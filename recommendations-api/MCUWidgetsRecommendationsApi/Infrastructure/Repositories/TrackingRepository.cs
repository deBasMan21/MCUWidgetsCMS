using System;
using MCUWidgetsRecommendationsApi.Infrastructure.Context;
using MCUWidgetsRecommendationsApi.Infrastructure.Interfaces;
using MCUWidgetsRecommendationsApi.Models.Tracking;

namespace MCUWidgetsRecommendationsApi.Infrastructure.Repositories
{
    public class TrackingRepository : ITrackingRepository
    {
        private readonly GeneralDbContext _context;

        public TrackingRepository(GeneralDbContext context)
        {
            _context = context;
        }

        public async Task AddTrackingSwipeEvent(TrackingSwipeEvent trackingSwipeEvent)
        {
            _context.TrackingSwipeEvents.Add(trackingSwipeEvent);
            await _context.SaveChangesAsync();
        }

        public async Task AddTrackingPageOpenEvent(TrackingPageOpenEvent trackingPageOpenEvent)
        {
            _context.TrackingPageOpenEvents.Add(trackingPageOpenEvent);
            await _context.SaveChangesAsync();
        }

        public async Task AddTrackingAppOpenEvent(TrackingAppOpenEvent trackingAppOpenEvent)
        {
            _context.TrackingAppOpenEvents.Add(trackingAppOpenEvent);
            await _context.SaveChangesAsync();
        }
    }
}