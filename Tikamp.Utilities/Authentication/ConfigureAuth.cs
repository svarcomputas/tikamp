using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Identity.Web;
using Microsoft.IdentityModel.Logging;

namespace Tikamp.Utilities.Authentication;

public static class ConfigureAuth
{
    public static IServiceCollection AddAuth(
        this IServiceCollection services,
        ConfigurationManager configuration)
    {
        services.AddOptions<AuthOptions>()
            .Bind(configuration.GetSection(AuthOptions.SectionKey));
        var authOptions = new AuthOptions();
        configuration.GetSection(AuthOptions.SectionKey).Bind(authOptions);

        IdentityModelEventSource.ShowPII = authOptions.EnableSensitiveLogging;
        IdentityModelEventSource.LogCompleteSecurityArtifact = authOptions.EnableSensitiveLogging;

        services.AddAuthentication(options =>
            {
                options.DefaultScheme = authOptions.AuthSchemas.FirstOrDefault();
                options.DefaultAuthenticateScheme = authOptions.AuthSchemas.FirstOrDefault();
                options.DefaultChallengeScheme = authOptions.AuthSchemas.FirstOrDefault();
            })
            .When(authOptions.AzureAd is not null,
                builder => builder
                    .AddMicrosoftIdentityWebApi(configuration, AuthOptions.AzureadSectionKey)
                    .EnableTokenAcquisitionToCallDownstreamApi()
                    .AddDistributedTokenCaches()
            );

        return services;
        // .When(authOptions.EnableWebsockets,
        //                 builder =>
        //                     builder.TryAddEnumerable(
        //                         ServiceDescriptor.Singleton<IPostConfigureOptions<JwtBearerOptions>,
        //                             ConfigureJwtBearerOptions>()))
        //            .AddAuthorization(
        //                 config =>
        //                 {
        //                     config.DefaultPolicy = new AuthorizationPolicyBuilder(authOptions?.AuthSchemas ?? [])
        //                                           .RequireAuthenticatedUser()
        //                                           .RequireDefaultClaim()
        //                                           .RequireAtLeastOneRole()
        //                                           .Build();
        //                 });
    }

    public static TBuilder When<TBuilder>(this TBuilder builder, bool whenToDo, Action<TBuilder> configure)
    {
        if (whenToDo) configure(builder);

        return builder;
    }
}