using Tikamp.Database.Models;
using Tikamp.Dto;

namespace Tikamp.Api.Mapping;

public static class ActivityMapping
{
    public static List<ActivityDto> ToDto(this List<Activity> activities)
    {
        return activities.Select(ToDto).ToList();
    }

    public static ActivityDto ToDto(this Activity activity)
    {
        return new ActivityDto
        {
            Month = activity.Month,
            Name = activity.Name,
            Level1 = activity.Level1,
            Level2 = activity.Level2,
            Level3 = activity.Level3,
            Description = activity.Description,
            Unit = activity.Unit,
            Type = activity.Type
        };
    }

    public static Activity ToModel(this PutActivityDto putActivityDto, int month)
    {
        return new Activity
        {
            Month = month,
            Name = putActivityDto.Name,
            Level1 = putActivityDto.Level1,
            Level2 = putActivityDto.Level2,
            Level3 = putActivityDto.Level3,
            Description = putActivityDto.Description,
            Unit = putActivityDto.Unit,
            Type = putActivityDto.Type
        };
    }
}