using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Tikamp.Database.Models;

[Index(nameof(UserEmail), IsUnique = true)]
public class User : BaseEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public required string Id { get; init; }

    public string? UserEmail { get; init; }

    public string? Name { get; init; }
}