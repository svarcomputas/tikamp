namespace Tikamp.Dto;

public class MonthlyLeaderboardEntryDto : LeaderboardEntryDto
{
    public required int ExerciseQuantity { get; init; }
    public required MedalTypeDto Medal { get; init; }
}