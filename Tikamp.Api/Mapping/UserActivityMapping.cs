using Tikamp.Database.Models;
using Tikamp.Dto;

namespace Tikamp.Api.Mapping;

public static class UserActivityMapping
{
    public static UserActivity ToModel(this PutUserActivityDto userActivity, string userId)
    {
        return new UserActivity
        {
            Month = userActivity.Date.Month,
            Id = Guid.NewGuid(),
            UserId = userId,
            Quantity = userActivity.Quantity,
            Day = userActivity.Date.Day
        };
    }

    public static List<UserActivityDto> ToDto(this List<UserActivity> userActivities)
    {
        return userActivities.Select(ToDto).ToList();
    }

    public static UserActivityDto ToDto(this UserActivity userActivity)
    {
        return new UserActivityDto
        {
            Quantity = userActivity.Quantity,
            Day = userActivity.Day
        };
    }
}