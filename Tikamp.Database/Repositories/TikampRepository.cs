using Microsoft.EntityFrameworkCore;
using Tikamp.Database.Models;

namespace Tikamp.Database.Repositories;

public class TikampRepository(TikampContext context)
{
    public DbSet<User> Users => context.Users;

    public async Task Save(CancellationToken cancelToken)
    {
        try
        {
            await context.SaveChangesAsync(cancelToken);
        }
        catch (ArgumentException argumentException) when (argumentException.Message.StartsWith(
            "An item with the same key has already been added"))
        {
            throw;
        }
    }
}