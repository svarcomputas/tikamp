using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;

namespace Tikamp.Utilities.Authentication;

public class AuthOptions
{
    public const string SectionKey = "Auth";
    public const string AzureadSectionKey = $"{SectionKey}:{nameof(AzureAd)}";

    public string ComputasTenant { get; set; } = "945fa749-c3d6-4e3d-a28a-283934e3cabd";
    public bool Enabled { get; set; } = true;
    public bool EnableWebsockets { get; set; } = true;
    public Dictionary<string, string> ApiKeys { get; set; } = new();

    public MicrosoftIdentityOptions? AzureAd { get; set; }

    public bool EnableSensitiveLogging { get; set; }

    public string[] AuthSchemas => [JwtBearerDefaults.AuthenticationScheme];
}