using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Tikamp.Database.Models;

namespace Tikamp.Database;

public class TikampContext(DbContextOptions<TikampContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        base.ConfigureConventions(configurationBuilder);
        var propertiesConfigurationBuilder = Database.IsSqlite()
            ? configurationBuilder.Properties<DateTimeOffset>().HaveConversion<DateTimeOffsetToBinaryConverter>()
            : configurationBuilder.Properties<DateTimeOffset>()
                .HaveConversion<DateTimeOffsetToUniversalTimeConverter>();

        // configurationBuilder.RegisterAllInPrimitiveValueConverters();
    }

    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
        OnBeforeSaving(CancellationToken.None).RunSynchronously();
        return base.SaveChanges(acceptAllChangesOnSuccess);
    }

    public override async Task<int> SaveChangesAsync(
        bool acceptAllChangesOnSuccess,
        CancellationToken cancellationToken = default
    )
    {
        await OnBeforeSaving(cancellationToken);

        return await base.SaveChangesAsync(
            acceptAllChangesOnSuccess,
            cancellationToken);
    }

    protected virtual Task OnBeforeSaving(CancellationToken cancellationToken)
    {
        HandleBaseEntityBeforeSave();
        return Task.CompletedTask;
    }

    private void HandleBaseEntityBeforeSave()
    {
        var nåTid = DateTimeOffset.Now.ToUniversalTime();

        foreach (var entry in ChangeTracker.Entries())
            if (entry.Entity is BaseEntity trackable)
                UpdateBaseEntityBeforeSave(entry, trackable, nåTid);
    }

    private static void UpdateBaseEntityBeforeSave(EntityEntry entry, BaseEntity trackable, DateTimeOffset nåTid)
    {
        switch (entry.State)
        {
            case EntityState.Modified:
                trackable.UpdatedAtDate = nåTid;
                entry.Property(nameof(trackable.CreatedAtDate)).IsModified = false;
                break;
            case EntityState.Added:
                if (trackable.CreatedAtDate == default) trackable.CreatedAtDate = nåTid;

                trackable.UpdatedAtDate = nåTid;
                break;
        }
    }
}

public class DateTimeOffsetToUniversalTimeConverter : ValueConverter<DateTimeOffset, DateTimeOffset>
{
    public DateTimeOffsetToUniversalTimeConverter()
        : base(
            d => d.ToUniversalTime(),
            d => d.ToUniversalTime())
    {
    }
}