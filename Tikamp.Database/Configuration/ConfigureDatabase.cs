using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Tikamp.Database.Repositories;

namespace Tikamp.Database.Configuration;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddDatabase(this IServiceCollection serviceCollection,
        IConfiguration config)
    {
        return serviceCollection
            .AddDbContext<TikampContext>(config)
            .AddTransient<TikampRepository>();
    }

    public static WebApplication EnsureDatabase(this WebApplication app)
    {
        var dbConfig = new DatabaseOptions();
        app.Configuration.GetSection(DatabaseOptions.SectionKey).Bind(dbConfig);
        if (dbConfig.UseSqlite)
        {
            using var scope = app.Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<TikampContext>();
            dbContext.Database.Migrate();
        }

        return app;
    }

    private static IServiceCollection AddDbContext<TContext>(this IServiceCollection serviceCollection,
        IConfiguration config)
        where TContext : DbContext
    {
        serviceCollection.AddOptions<DatabaseOptions>().Bind(config.GetSection(DatabaseOptions.SectionKey));
        var databaseOptions = new DatabaseOptions();
        config.GetSection(DatabaseOptions.SectionKey).Bind(databaseOptions);

        serviceCollection.AddScoped<TContext>(provider =>
            provider.GetRequiredService<IDbContextFactory<TContext>>().CreateDbContext());
        return databaseOptions.UseSqlite
            ? serviceCollection.AddSqliteDbContext<TContext>(databaseOptions)
            : serviceCollection.AddNpgsqlDbContext<TContext>(databaseOptions);
    }

    private static IServiceCollection AddSqliteDbContext<TContext>(this IServiceCollection serviceCollection,
        DatabaseOptions dbConfig)
        where TContext : DbContext
    {
        var dbConfigSqliteDbPath = string.IsNullOrEmpty(dbConfig.SqliteDbPath)
            ? AppDomain.CurrentDomain.FriendlyName
            : dbConfig.SqliteDbPath;
        var dbPath = Path.GetFullPath(
            Path.Combine(
                AppDomain.CurrentDomain.GetData("DataDirectory") as string ?? AppDomain.CurrentDomain.BaseDirectory,
                "../../../", dbConfigSqliteDbPath));

        return serviceCollection.AddPooledDbContextFactory<TContext>(
            options =>
            {
                options.EnableSensitiveDataLogging(dbConfig.EnableSensitiveDataLogging);
                options.EnableDetailedErrors(dbConfig.EnableSensitiveDataLogging);
                options.UseSqlite($"Data Source={dbPath}");
            });
    }

    private static IServiceCollection AddNpgsqlDbContext<TContext>(this IServiceCollection serviceCollection,
        DatabaseOptions config)
        where TContext : DbContext
    {
        return serviceCollection
            .AddMemoryCache()
            .AddTransient<DbTokenHelper>()
            .AddPooledDbContextFactory<TContext>(
                (provider, opt) =>
                    opt.UseNpgsql(config.ConnectionString(), builder => builder.AddAdAuthentication(provider)));
    }
}