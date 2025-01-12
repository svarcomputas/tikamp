using FluentValidation;

namespace Tikamp.Dto;

public class PutActivityDto
{
    public required string Name { get; init; }
    public required int? Level1 { get; init; }
    public required int? Level2 { get; init; }
    public required int? Level3 { get; init; }
    public required string? Description { get; init; }
    public required ActivityUnit? Unit { get; init; }
    public required ActivityType Type { get; init; }
}

public class PutActivityDtoValidator : AbstractValidator<PutActivityDto>
{
    public PutActivityDtoValidator()
    {
        When(dto => dto.Level1 is not null, () =>
        {
            RuleFor(dto => dto.Level2).NotNull().GreaterThan(dto => dto.Level1);
            RuleFor(dto => dto.Level3).NotNull().GreaterThan(dto => dto.Level2);
            RuleFor(dto => dto.Unit).NotNull();
        });

        When(dto => dto.Level1 is null, () => { RuleFor(dto => dto.Description).NotNull(); });
    }
}