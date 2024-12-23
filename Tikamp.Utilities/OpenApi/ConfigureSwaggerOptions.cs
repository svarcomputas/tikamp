using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using Swashbuckle.AspNetCore.SwaggerGen;
using Tikamp.Utilities.Authentication;

namespace Tikamp.Utilities.OpenApi;

public class ConfigureSwaggerOptions(
    IOptions<AuthOptions> config,
    IHostEnvironment hostEnvironment)
    : IConfigureOptions<SwaggerGenOptions>
{
    private readonly AuthOptions _authOptions = config.Value;

    public void Configure(SwaggerGenOptions options)
    {
        options.OperationFilter<AppendAuthorizeToSummaryOperationFilter>();
        options.OperationFilter<SecurityRequirementsOperationFilter>(false, JwtBearerDefaults.AuthenticationScheme);
        options.OperationFilter<SecurityRequirementsOperationFilter>(false, "BearerAsApiKey");

        if (_authOptions.AzureAd is not null)
        {
            options.AddSecurityDefinition(
                "BearerAsApiKey",
                new OpenApiSecurityScheme
                {
                    Description = "Please enter into field the word 'Bearer' following by space and JWT\"",
                    In = ParameterLocation.Header,
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey
                });
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
    }

    private static Uri AuthorizationUrl(MicrosoftIdentityOptions adOptions)
    {
        return new Uri(
            $"{adOptions.Instance}/{adOptions.TenantId}/oauth2/v2.0/authorize");
    }

    private static Uri TokenUrl(MicrosoftIdentityOptions adOptions)
    {
        return new Uri(
            $"{adOptions.Instance}/{adOptions.TenantId}/oauth2/v2.0/token");
    }
}