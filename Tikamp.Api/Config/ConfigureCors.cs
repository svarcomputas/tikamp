namespace Tikamp.Api.Config;

public static class ConfigureCors
{
    public static IServiceCollection AddCorsPolicies(this IServiceCollection services, IConfiguration config)
    {
        services.AddOptions<CorsOptions>()
                .Bind(config.GetSection(CorsOptions.SectionKey));
        var corsOptions = new CorsOptions();
        config.GetSection(CorsOptions.SectionKey).Bind(corsOptions);
        return services.AddCors(options =>
            options.AddDefaultPolicy(policy => policy.WithOrigins(corsOptions.AllowedOrigins)
                                                     .AllowAnyHeader()
                                                     .AllowAnyMethod()
                                                     .AllowCredentials()));
    }
}