using MCUWidgetsRecommendationsApi.Controllers.ControllerModels;
using MCUWidgetsRecommendationsApi.Infrastructure.Interfaces;
using MCUWidgetsRecommendationsApi.Models.Enums;
using MCUWidgetsRecommendationsApi.Models.Tracking;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace MCUWidgetsRecommendationsApi.Controllers;

[ApiController]
[Route("[controller]")]
public class TrackingController : ControllerBase
{
    private readonly ITrackingRepository _trackingRepository;

    public TrackingController(ITrackingRepository trackingRepository)
    {
        _trackingRepository = trackingRepository;
    }

    [HttpPost("AppOpen/{userId}")]
    public async Task<ActionResult> TrackAppOpen(string userId)
    {
        await _trackingRepository.AddTrackingAppOpenEvent(new TrackingAppOpenEvent() { userId = userId });
        return Ok();
    }

    [HttpPost("PageOpen/{userId}")]
    public async Task<ActionResult> TrackPageOpen([FromBody] CreatePageOpenEvent trackingPageOpenEvent, string userId)
    {
        TrackingPageOpenEvent pageEvent = new TrackingPageOpenEvent() { userId = userId, pageId = trackingPageOpenEvent.pageId, pageType = trackingPageOpenEvent.pageType };
        await _trackingRepository.AddTrackingPageOpenEvent(pageEvent);
        return Ok();
    }

    [HttpPost("Swipe/{userId}")]
    public async Task<ActionResult> TrackSwipe([FromBody] CreateSwipeEvent trackingSwipeEvent, string userId)
    {
        TrackingSwipeEvent swipeEvent = new TrackingSwipeEvent() { userId = userId, pageId = trackingSwipeEvent.pageId, pageType = trackingSwipeEvent.pageType, swipeDirection = trackingSwipeEvent.swipeDirection };
        await _trackingRepository.AddTrackingSwipeEvent(swipeEvent);
        return Ok();
    }
}

