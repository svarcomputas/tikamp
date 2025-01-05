using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Tikamp.Dto;

namespace Tikamp.Database.Models;

public class Activity : BaseEntity
{
    [Key]
    [Range(1, 12)]
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public required int Month { get; init; }

    public required string Name { get; set; }
    public required int? Level1 { get; set; }
    public required int? Level2 { get; set; }
    public required int? Level3 { get; set; }
    public required string? Description { get; set; }
    public required ActivityUnit? Unit { get; set; }
}