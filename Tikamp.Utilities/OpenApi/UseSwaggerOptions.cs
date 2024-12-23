using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Tikamp.Utilities.Authentication;

namespace Tikamp.Utilities.OpenApi;

public static class UseSwaggerOptions
{
    public static IApplicationBuilder EnableSwaggerUi(this IApplicationBuilder app)
    {
        var env = app.ApplicationServices.GetRequiredService<IHostEnvironment>();
        var authOptions = app.ApplicationServices.GetRequiredService<IOptions<AuthOptions>>();
        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            if (authOptions.Value.AzureAd is not null && !env.IsProduction())
            {
                options.OAuthClientId(authOptions.Value.AzureAd.ClientId);
                options.OAuthScopes(authOptions.Value.AzureAd.Scope.ToArray());
                options.OAuthUsePkce();
            }

            options.DisplayRequestDuration();
        });

        return app;
    }
}