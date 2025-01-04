using System;
using FluentValidation;

namespace Tikamp.Dto;

public class PutUserActivityDto
{
    public required DateTime Date { get; init; }
    public required int Quantity { get; init; }
}

public class PutUserActivityDtoValidator : AbstractValidator<PutUserActivityDto>
{
    public PutUserActivityDtoValidator()
    {
        RuleFor(dto => dto.Quantity).GreaterThan(0).NotNull();
    }
}