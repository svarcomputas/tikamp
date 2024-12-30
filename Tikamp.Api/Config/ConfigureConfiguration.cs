namespace Tikamp.Api.Config;

public static class ConfigureConfiguration
{
    private static readonly string _prodEnvironment = "prod";

    public static WebApplicationBuilder AddConfiguration(
        this WebApplicationBuilder applicationBuilder,
        string appSettingsFolder = "AppSettings")
    {
        applicationBuilder.Configuration
            .SetBasePath(Path.Join(applicationBuilder.Environment.ContentRootPath, appSettingsFolder))
            .AddJsonFile("appsettings.json", false, false)
            .AddJsonFile(
                $"appsettings.{applicationBuilder.Environment.MiljøNavn()}.json",
                true,
                false)
            .AddEnvironmentVariables()
            .AddInMemoryCollection();
        // .AddKeyVault(applicationBuilder.Environment.IsDevelopment());
        return applicationBuilder;
    }

    private static bool IsProd(this IHostEnvironment hostingEnvironment)
    {
        return hostingEnvironment.IsEnvironment(_prodEnvironment) || hostingEnvironment.IsProduction();
    }

    private static string MiljøNavn(this IHostEnvironment hostingEnvironment)
    {
        return hostingEnvironment.IsProd() ? _prodEnvironment : hostingEnvironment.EnvironmentName;
    }
}