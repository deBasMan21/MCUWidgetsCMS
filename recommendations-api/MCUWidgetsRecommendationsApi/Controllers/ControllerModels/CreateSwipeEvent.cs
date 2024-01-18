using MCUWidgetsRecommendationsApi.Models.Enums;
using MCUWidgetsRecommendationsApi.Models.Tracking;

namespace MCUWidgetsRecommendationsApi.Controllers.ControllerModels
{
    public class CreateSwipeEvent
    {
        public int pageId { get; set; }
        public ClickPageType pageType { get; set; }
        public SwipeDirection swipeDirection { get; set; }
    }
}