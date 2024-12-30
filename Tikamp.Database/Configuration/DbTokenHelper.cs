using Azure.Core;
using Azure.Identity;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace Tikamp.Database.Configuration;

public class DbTokenHelper(IMemoryCache cache, ILogger<DbTokenHelper> logger)
{
    private static readonly TokenRequestContext
        TokenRequestContext = new(["https://ossrdbms-aad.database.windows.net"]);

    private readonly TokenCredential _tokenCredential = new DefaultAzureCredential(new DefaultAzureCredentialOptions
    {
        ExcludeEnvironmentCredential = true,
        ExcludeInteractiveBrowserCredential = true,
        ExcludeAzurePowerShellCredential = true,
        ExcludeSharedTokenCacheCredential = true,
        ExcludeVisualStudioCodeCredential = true,
        ExcludeVisualStudioCredential = true,
        ExcludeAzureCliCredential = false,
        ExcludeManagedIdentityCredential = false
    });

    public string RequestToken(string host, string db, string username)
    {
        var cacheKey = $"{host}-{db}-{username}";
        if (cache.TryGetValue<AccessToken>(cacheKey, out var cachedAccessToken)) return cachedAccessToken.Token;

        var accessToken = _tokenCredential.GetToken(TokenRequestContext, CancellationToken.None);
        cache.Set(cacheKey, accessToken, accessToken.ExpiresOn.AddSeconds(-30));
        logger.LogInformation("Fetched new db token for {DatabaseUsername} that expires in: {TokenExpiresInSeconds}s",
            username, Math.Round(accessToken.ExpiresOn.Subtract(DateTimeOffset.Now).TotalSeconds));
        return accessToken.Token;
    }
}