using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Tikamp.Database;

public class TikampContextFactory : IDesignTimeDbContextFactory<TikampContext>
{
    public TikampContext CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable("sqlConnectionMigration") ?? ".";
        var optionsBuilder = new DbContextOptionsBuilder<TikampContext>();
        optionsBuilder.UseNpgsql(connectionString);

        return new TikampContext(optionsBuilder.Options);
    }
}