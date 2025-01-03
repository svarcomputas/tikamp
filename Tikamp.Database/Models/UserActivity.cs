using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tikamp.Database.Models;

public class UserActivity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public required Guid Id { get; init; }

    public required string UserId { get; init; }

    [ForeignKey(nameof(UserId))]
    public User? User { get; init; }

    [Range(1, 12)]
    public required int Month { get; init; }

    [ForeignKey(nameof(Month))]
    public Activity? Activity { get; init; }

    public required int Quantity { get; set; }
    public required int Day { get; init; }
}