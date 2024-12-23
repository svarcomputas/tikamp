using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Npgsql.EntityFrameworkCore.PostgreSQL.Infrastructure;

namespace Tikamp.Database.Configuration;

public static class ConfigureAdAuthentication
{
    public static NpgsqlDbContextOptionsBuilder AddAdAuthentication(this NpgsqlDbContextOptionsBuilder builder,
        IServiceProvider provider)
    {
        var options = provider.GetRequiredService<IOptions<DatabaseOptions>>().Value;
        if (!options.UseAnyTokenAuth) return builder;

        var databaseAuthType = options.UseSystemIdentity ? "SystemIdentity" : "Identity";
        var logger = provider.GetRequiredService<ILogger<DatabaseOptions>>();
        logger.LogInformation("Using {DatabaseAuthType} {DatabaseUsername} to authenticate with database",
            databaseAuthType, options.GetUsername);

        builder.ProvidePasswordCallback((host, _, database, username)
            => provider.GetRequiredService<DbTokenHelper>().RequestToken(host, database, username));
        return builder;
    }
}