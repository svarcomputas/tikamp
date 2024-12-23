namespace Tikamp.Database.Models;

public class BaseEntity
{
    public DateTimeOffset CreatedAtDate { get; set; }

    public DateTimeOffset UpdatedAtDate { get; set; }
}