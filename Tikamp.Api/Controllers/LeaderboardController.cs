using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Tikamp.Api.Services;
using Tikamp.Dto;

namespace Tikamp.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/leaderboards")]
public class LeaderboardsController(LeaderboardService leaderboardService, ILogger<LeaderboardsController> logger) : ControllerBase
{
    [HttpGet("month/{month}")]
    [SwaggerResponse((int)HttpStatusCode.OK, "Ok", typeof(List<MonthlyLeaderboardEntryDto>))]
    public async Task<ActionResult<List<MonthlyLeaderboardEntryDto>>> GetMonthlyLeaderboard(int month)
    {
        logger.LogInformation("Getting leaderboard for month {Month}", month);
        var leaderboard = await leaderboardService.GetMonthlyLeaderboardAsync(month);
        return Ok(leaderboard);
    }

    [HttpGet("total")]
    [SwaggerResponse((int)HttpStatusCode.OK, "Ok", typeof(List<TotalLeaderboardEntryDto>))]
    public async Task<ActionResult<List<TotalLeaderboardEntryDto>>> GetTotalLeaderboard()
    {
        logger.LogInformation("Getting total leaderboard");
        var leaderboard = await leaderboardService.GetTotalLeaderboardAsync();
        return Ok(leaderboard);
    }
}