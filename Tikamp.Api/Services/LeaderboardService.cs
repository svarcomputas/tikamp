using System.Collections.Concurrent;
using Microsoft.EntityFrameworkCore;
using Tikamp.Database.Repositories;
using Tikamp.Dto;

namespace Tikamp.Api.Services;

public class MonthlyLeaderboardCache
{
    public DateTimeOffset LastUpdated { get; set; }
    public bool ShouldBeUpdated { get; set; } = true;
    public List<MonthlyLeaderboardEntryDto> Leaderboard { get; set; } = new ();
}

public class LeaderboardService(TikampRepository repository, ILogger<LeaderboardService> logger)
{
    private static readonly ConcurrentDictionary<int, MonthlyLeaderboardCache> MonthlyCache = new ();

    public async Task<List<MonthlyLeaderboardEntryDto>> GetMonthlyLeaderboardAsync(int month)
    {
        if (MonthlyCache.TryGetValue(month, out var cacheEntry))
            if (!cacheEntry.ShouldBeUpdated)
                return cacheEntry.Leaderboard;

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
        var activity = await repository.Activities
                                       .Where(activity => activity.Month == month)
                                       .FirstAsync();
        var leaderboardList = groupedByUser.Select((input, index) =>
                                            {
                                                var placementPoints = GetPlacementPoints(index, groupedByUser.Count);
                                                var levelPoints = input.TotalCount >= activity.Level3 ? 300 : input.TotalCount >= activity.Level2 ? 200 : input.TotalCount >= activity.Level1 ? 100 : 0;
                                                return new MonthlyLeaderboardEntryDto
                                                {
                                                    UserId = input.UserId,
                                                    UserName = input.UserName,
                                                    Points = placementPoints + levelPoints,
                                                    ExerciseQuantity = input.TotalCount,
                                                    MonthPointsFromLevel = levelPoints,
                                                    MonthPlacementPoints = placementPoints
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
            0 => 300,
            1 => 260,
            2 => 220,
            _ => percentile switch
            {
                <= 0.25 => 180,
                <= 0.50 => 140,
                <= 0.75 => 100,
                _ => 50
            }
        };
    }

    public async Task<List<LeaderboardEntryDto>> GetTotalLeaderboardAsync()
    {
        var months = Enumerable.Range(1, 12).ToList();
        var totalScores = new Dictionary<string, List<int>>();
        var userNames = new Dictionary<string, string>();

        foreach (var month in months)
        {
            var monthly = await GetMonthlyLeaderboardAsync(month);
            foreach (var entry in monthly)
            {
                if (totalScores.TryAdd(entry.UserId, [0, 0, 0])) userNames[entry.UserId] = entry.UserName;

                totalScores[entry.UserId][0] += entry.Points;
                totalScores[entry.UserId][1] += entry.MonthPlacementPoints;
                totalScores[entry.UserId][2] += entry.MonthPointsFromLevel;
            }
        }

        var result = totalScores
                    .Select(x => new LeaderboardEntryDto
                     {
                         UserId = x.Key,
                         UserName = userNames[x.Key],
                         Points = x.Value[0],
                         MonthPlacementPoints = x.Value[1],
                         MonthPointsFromLevel = x.Value[2]
                     })
                    .OrderByDescending(x => x.Points)
                    .ToList();

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
    }
}