using System;

namespace Tikamp.Dto;

public class UserActivityDto
{
    public required int Day { get; init; }
    public required int Quantity { get; init; }
}