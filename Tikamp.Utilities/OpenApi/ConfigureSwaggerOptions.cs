using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using Swashbuckle.AspNetCore.SwaggerGen;
using Tikamp.Utilities.Authentication;

namespace Tikamp.Utilities.OpenApi;

public class ConfigureSwaggerOptions(
    IOptions<AuthOptions> config)
    : IConfigureOptions<SwaggerGenOptions>
{
    private readonly AuthOptions _authOptions = config.Value;

    public void Configure(SwaggerGenOptions options)
    {
        options.OperationFilter<AppendAuthorizeToSummaryOperationFilter>();
        options.OperationFilter<SecurityRequirementsOperationFilter>(false, JwtBearerDefaults.AuthenticationScheme);

        if (_authOptions.AzureAd is not null)
            options.AddSecurityDefinition(
                JwtBearerDefaults.AuthenticationScheme,
                new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.OAuth2,
                    Flows = new OpenApiOAuthFlows
                    {
                        AuthorizationCode = new OpenApiOAuthFlow
                        {
                            AuthorizationUrl = AuthorizationUrl(_authOptions.AzureAd),
                            TokenUrl = TokenUrl(_authOptions.AzureAd),
                            Scopes = _authOptions.AzureAd.Scope.ToDictionary(s => s, s => string.Empty)
                        }
                    },
                    Description = "OpenId Security Scheme"
                });
    }

    private static Uri AuthorizationUrl(MicrosoftIdentityOptions adOptions)
    {
        return new Uri("https://login.microsoftonline.com/945fa749-c3d6-4e3d-a28a-283934e3cabd/oauth2/v2.0/authorize");
        //$"{adOptions.Instance}/{adOptions.TenantId}/oauth2/v2.0/authorize");
    }

    private static Uri TokenUrl(MicrosoftIdentityOptions adOptions)
    {
        return new Uri("https://login.microsoftonline.com/945fa749-c3d6-4e3d-a28a-283934e3cabd/oauth2/v2.0/token");
        //$"{adOptions.Instance}/{adOptions.TenantId}/oauth2/v2.0/token");
    }
}