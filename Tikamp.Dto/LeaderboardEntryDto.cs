namespace Tikamp.Dto;

public class LeaderboardEntryDto
{
    public required string UserId { get; init; }
    public required string UserName { get; init; }
    public required int Points { get; init; }
    public required int MonthPointsFromLevel { get; init; }
    public required int MonthPlacementPoints { get; init; }
    public required int Placement { get; init; }
}