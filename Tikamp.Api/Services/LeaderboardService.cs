using System.Collections.Concurrent;
using Microsoft.EntityFrameworkCore;
using Tikamp.Database.Models;
using Tikamp.Database.Repositories;
using Tikamp.Dto;

namespace Tikamp.Api.Services;

public class MonthlyLeaderboardCache
{
    public DateTimeOffset LastUpdated { get; set; }
    public bool ShouldBeUpdated { get; set; } = true;
    public List<MonthlyLeaderboardEntryDto> Leaderboard { get; set; } = new ();
}

public class TotalLeaderboardCache
{
    public bool ShouldBeUpdated { get; set; } = true;
    public List<TotalLeaderboardEntryDto> Leaderboard { get; set; } = new ();
}

public class LeaderboardService(TikampRepository repository, ILogger<LeaderboardService> logger)
{
    private static readonly int TotalCacheKey = 1;
    private static readonly ConcurrentDictionary<int, MonthlyLeaderboardCache> MonthlyCache = new ();
    private static readonly ConcurrentDictionary<int, TotalLeaderboardCache> TotalCache = new ();


    public async Task<List<MonthlyLeaderboardEntryDto>> GetMonthlyLeaderboardAsync(int month)
    {
        if (MonthlyCache.TryGetValue(month, out var cacheEntry))
            if (!cacheEntry.ShouldBeUpdated)
                return cacheEntry.Leaderboard;
        var activity = await repository.Activities
                                       .Where(activity => activity.Month == month)
                                       .FirstOrDefaultAsync();
        if (activity is null || activity.Type != ActivityType.Activity)
        {
            var emptyLeaderboard = new List<MonthlyLeaderboardEntryDto>();
            MonthlyCache[month] = new MonthlyLeaderboardCache
            {
                LastUpdated = DateTimeOffset.UtcNow,
                Leaderboard = emptyLeaderboard,
                ShouldBeUpdated = false
            };
            return emptyLeaderboard;
        }

        var userActivities = await repository.UserActivities
                                             .Include(ua => ua.User)
                                             .Where(ua => ua.Month == month)
                                             .ToListAsync();

        if (!userActivities.Any())
        {
            var emptyLeaderboard = new List<MonthlyLeaderboardEntryDto>();
            MonthlyCache[month] = new MonthlyLeaderboardCache
            {
                LastUpdated = DateTimeOffset.UtcNow,
                Leaderboard = emptyLeaderboard,
                ShouldBeUpdated = false
            };
            return emptyLeaderboard;
        }

        logger.LogInformation("Generating leaderboard for month {Month}", month);
        var groupedByUser = userActivities
                           .GroupBy(ua => ua.User!.Id)
                           .Select(g =>
                            {
                                var firstUser = g.First().User;
                                var totalCount = g.Sum(a => a.Quantity);
                                return new
                                {
                                    UserId = firstUser!.Id,
                                    UserName = firstUser.Name,
                                    TotalCount = totalCount
                                };
                            })
                           .Where(x => x.TotalCount > 0)
                           .OrderByDescending(x => x.TotalCount)
                           .ToList();
        var prevCount = -1;
        var prevScore = -1;
        var prevPlacement = -1;
        var leaderboardList = groupedByUser.Select((input, index) =>
                                            {
                                                var placementPoints = prevCount == input.TotalCount ? prevScore : GetPlacementPoints(index, groupedByUser.Count);
                                                var placement = prevCount == input.TotalCount ? prevPlacement : index + 1;
                                                var (levelPoints, medal) = GetMedalAndLevelPoints(input.TotalCount, activity);
                                                
                                                prevCount = input.TotalCount;
                                                prevScore = placementPoints;
                                                prevPlacement = placement;
                                                return new MonthlyLeaderboardEntryDto
                                                {
                                                    UserId = input.UserId,
                                                    UserName = input.UserName,
                                                    Points = placementPoints + levelPoints,
                                                    ExerciseQuantity = input.TotalCount,
                                                    MonthPointsFromLevel = levelPoints,
                                                    MonthPlacementPoints = placementPoints,
                                                    Medal = medal,
                                                    Placement = placement,
                                                };
                                            })
                                           .OrderByDescending(x => x.Points)
                                           .ToList();

        MonthlyCache[month] = new MonthlyLeaderboardCache
        {
            LastUpdated = DateTime.UtcNow,
            Leaderboard = leaderboardList,
            ShouldBeUpdated = false
        };

        return leaderboardList;
    }

    private int GetPlacementPoints(int placement, int totalPlacements)
    {
        var percentile = (double)(placement + 1) / totalPlacements;
        return placement switch
        {
            0 => 400,
            1 => 360,
            2 => 330,
            3 => 300,
            _ => percentile switch
            {
                <= 0.2 => 270,
                <= 0.3 => 240,
                <= 0.4 => 210,
                <= 0.5 => 180,
                <= 0.6 => 150,
                <= 0.7 => 120,
                <= 0.8 => 90,
                <= 0.9 => 60,
                _ => 30
            }
        };
    }

    private (int, MedalTypeDto) GetMedalAndLevelPoints(int totalCount, Activity activity)
    {
        if (totalCount >= activity.Level3) return (300, MedalTypeDto.Gold);
        if (totalCount >= activity.Level2) return (200, MedalTypeDto.Silver);
        if (totalCount >= activity.Level1) return (100, MedalTypeDto.Bronze);

        return (0, MedalTypeDto.None);
    }

    public async Task<List<TotalLeaderboardEntryDto>> GetTotalLeaderboardAsync()
    {
        if (TotalCache.TryGetValue(TotalCacheKey, out var cacheEntry))
            if (!cacheEntry.ShouldBeUpdated)
                return cacheEntry.Leaderboard;
        var months = Enumerable.Range(1, 12).ToList();
        var totalScores = new Dictionary<string, List<int>>();
        var userNames = new Dictionary<string, string>();
        var medals = new Dictionary<string, List<MedalTypeDto>>();

        foreach (var month in months)
        {
            var monthly = await GetMonthlyLeaderboardAsync(month);
            foreach (var entry in monthly)
            {
                if (totalScores.TryAdd(entry.UserId, [0, 0, 0]))
                {
                    userNames[entry.UserId] = entry.UserName;
                    medals.TryAdd(entry.UserId, [MedalTypeDto.None]);
                }

                totalScores[entry.UserId][0] += entry.Points;
                totalScores[entry.UserId][1] += entry.MonthPlacementPoints;
                totalScores[entry.UserId][2] += entry.MonthPointsFromLevel;
                medals[entry.UserId].Add(entry.Medal);
            }
        }

        var prevScore = -1;
        var prevPlacement = -1;
        var result = totalScores
                    .Select(x => new TotalLeaderboardEntryDto
                     {
                         UserId = x.Key,
                         UserName = userNames[x.Key],
                         Points = x.Value[0],
                         MonthPlacementPoints = x.Value[1],
                         MonthPointsFromLevel = x.Value[2],
                         Medals = medals[x.Key]
                                 .Where(m => m != MedalTypeDto.None)
                                 .ToList(),
                         Placement = -1
                     })
                    .OrderByDescending(x => x.Points)
                    .Select((x, index) =>
                     {
                         var placement = prevScore == x.Points ? prevPlacement : index + 1;
                         prevPlacement = placement;
                         return new TotalLeaderboardEntryDto
                         {
                             UserId = x.UserId,
                             UserName = x.UserName,
                             Points = x.Points,
                             MonthPlacementPoints = x.MonthPlacementPoints,
                             MonthPointsFromLevel = x.MonthPointsFromLevel,
                             Medals = x.Medals,
                             Placement = placement
                         };
                     })
                    .ToList();

        TotalCache[TotalCacheKey] = new TotalLeaderboardCache
        {
            ShouldBeUpdated = false,
            Leaderboard = result
        };
        return result;
    }

    public void InvalidateMonth(int month)
    {
        logger.LogInformation("Invalidating cache for month {Month}", month);
        if (MonthlyCache.TryGetValue(month, out var cacheEntry))
        {
            cacheEntry.LastUpdated = DateTimeOffset.MinValue;
            cacheEntry.ShouldBeUpdated = true;
        }

        logger.LogInformation("Invalidating totalCache");
        if (TotalCache.TryGetValue(TotalCacheKey, out var totalCache)) totalCache.ShouldBeUpdated = true;
    }
}