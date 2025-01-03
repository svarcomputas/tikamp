using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;
using Tikamp.Api.Mapping;
using Tikamp.Database.Models;
using Tikamp.Database.Repositories;
using Tikamp.Dto;

namespace Tikamp.Api.Services;

public class UserActivityService(TikampRepository repository, UserService userService, ActivitiesServices activitiesServices, LeaderboardService leaderboardService)
{
    public async Task<MonthlyUserActivityDto?> GetActivityByMonth(int month, ClaimsPrincipal claims, string? objectId, CancellationToken cancellationToken)
    {
        var userIdToFetchFor = objectId ?? claims.GetObjectId();
        var userActivity = await repository.UserActivities
                                           .Include(ua => ua.Activity)
                                           .Include(ua => ua.User)
                                           .Where(ua => ua.UserId == userIdToFetchFor && ua.Month == month).ToListAsync(cancellationToken);
        return userActivity.Any()
                   ? new MonthlyUserActivityDto
                   {
                       Activity = userActivity.First().Activity!.ToDto(),
                       UsersActivities = userActivity.ToDto(),
                       UserName = userActivity.First().User!.Name,
                       IsSelf = objectId is null || objectId == claims.GetObjectId()
                   }
                   : null;
    }

    public async Task RegisterActivity(PutUserActivityDto dto, ClaimsPrincipal claims, CancellationToken cancellationToken)
    {
        var user = await userService.GetOrCreateUserAsync(claims, cancellationToken);
        var existingUserActivity = await GetActivityByDate(dto.Date, user, cancellationToken);
        if (existingUserActivity is null)
        {
            var activity = await activitiesServices.GetActivityAsync(dto.Date.Month, cancellationToken);
            if (activity is null) throw new ArgumentException("Kan ikke registrer for måned, siden den ikke finnes i db");

            var newUserActivity = dto.ToModel(user.Id);
            await repository.UserActivities.AddAsync(newUserActivity, cancellationToken);
        }
        else
        {
            PatchUserActivity(existingUserActivity, dto);
        }

        await repository.Save(cancellationToken);
        leaderboardService.InvalidateMonth(dto.Date.Month);
    }

    private static void PatchUserActivity(UserActivity existing, PutUserActivityDto updated)
    {
        existing.Quantity = updated.Quantity;
    }

    private async Task<UserActivity?> GetActivityByDate(DateTimeOffset date, User user, CancellationToken cancellationToken)
    {
        var userActivity = await repository.UserActivities.Where(ua => ua.UserId == user.Id && ua.Day == date.Day && ua.Month == date.Month).FirstOrDefaultAsync(cancellationToken);
        return userActivity;
    }
}