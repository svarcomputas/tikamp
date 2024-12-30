using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;

namespace Tikamp.Utilities.Authentication;

public class AuthOptions
{
    public const string SectionKey = "Auth";
    public const string AzureadSectionKey = $"{SectionKey}:{nameof(AzureAd)}";

    public bool Enabled { get; set; } = true;
    public bool EnableWebsockets { get; set; } = true;
    public Dictionary<string, string> ApiKeys { get; set; } = new();

    public MicrosoftIdentityOptions? AzureAd { get; set; }

    public bool EnableSensitiveLogging { get; set; }

    public string[] AuthSchemas => [JwtBearerDefaults.AuthenticationScheme];
}