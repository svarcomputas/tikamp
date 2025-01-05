namespace Tikamp.Dto;

public class ActivityDto
{
    public required int Month { get; init; }
    public required string Name { get; init; }
    public required int? Level1 { get; init; }
    public required int? Level2 { get; init; }
    public required int? Level3 { get; init; }
    public required string? Description { get; init; }
    public required ActivityUnit? Unit { get; init; }
}