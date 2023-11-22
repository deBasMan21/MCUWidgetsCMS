using MCUWidgetsRecommendationsApi.Models.Enums;

namespace MCUWidgetsRecommendationsApi.Controllers.ControllerModels
{
    public class CreatePageOpenEvent
    {
        public int pageId { get; set; }
        public ClickPageType pageType { get; set; }
    }
}