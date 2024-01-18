using MCUWidgetsRecommendationsApi.Controllers.ControllerModels;
using MCUWidgetsRecommendationsApi.Infrastructure.Interfaces;
using MCUWidgetsRecommendationsApi.Infrastructure.Repositories;
using MCUWidgetsRecommendationsApi.Models;
using MCUWidgetsRecommendationsApi.Models.Enums;
using MCUWidgetsRecommendationsApi.Models.Tracking;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace MCUWidgetsRecommendationsApi.Controllers;

[ApiController]
[Route("[controller]")]
public class RecommendationsController : ControllerBase
{
    private readonly IRecommendationsRepository _recommendationsRepository;

    public RecommendationsController(IRecommendationsRepository recommendationsRepository)
    {
        _recommendationsRepository = recommendationsRepository;
    }

    [HttpGet("Smart/{userId}")]
    public ActionResult GetSmartRecommendations(string userId, int? page, int? pageSize)
    {
        return Ok();
    }

    [HttpGet("MostPopular/{userId}")]
    public ActionResult<List<RecommendedPage>> GetMostPopularRecommendations(string userId, int? page, int? pageSize)
    {
        return Ok(_recommendationsRepository.GetMostPopularRecommendations(userId, page ?? 1, pageSize ?? 5));
    }
}
