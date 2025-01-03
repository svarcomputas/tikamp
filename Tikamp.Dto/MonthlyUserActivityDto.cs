using System.Collections.Generic;

namespace Tikamp.Dto;

public class MonthlyUserActivityDto
{
    public required ActivityDto Activity { get; init; }
    public required List<UserActivityDto> UsersActivities { get; init; }
    public required string UserName { get; init; }
    public required bool IsSelf { get; init; }
}