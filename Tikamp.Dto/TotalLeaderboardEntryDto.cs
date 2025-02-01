using System.Collections.Generic;

namespace Tikamp.Dto;

public class TotalLeaderboardEntryDto : LeaderboardEntryDto
{
    public required List<MedalTypeDto> Medals { get; init; }
}