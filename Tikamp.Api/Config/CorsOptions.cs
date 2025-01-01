namespace Tikamp.Api.Config;

public class CorsOptions
{
    public const string SectionKey = "Cors";
    public string[] AllowedOrigins { get; set; } = [];
}