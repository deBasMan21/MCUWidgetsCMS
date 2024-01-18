using System;
using MCUWidgetsRecommendationsApi.Models.Tracking;

namespace MCUWidgetsRecommendationsApi.Infrastructure.Interfaces
{
    public interface ITrackingRepository
    {
        public Task AddTrackingSwipeEvent(TrackingSwipeEvent trackingSwipeEvent);
        public Task AddTrackingPageOpenEvent(TrackingPageOpenEvent trackingPageOpenEvent);
        public Task AddTrackingAppOpenEvent(TrackingAppOpenEvent trackingAppOpenEvent);
    }
}