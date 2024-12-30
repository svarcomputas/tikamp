namespace Tikamp.Database.Configuration;

public class DatabaseOptions
{
    private readonly string? _systemIdentityName = Environment.GetEnvironmentVariable("WEBSITE_SITE_NAME");
    public static string SectionKey => "Database";

    public string Host { get; set; } = string.Empty;

    public string Username { get; set; } = string.Empty;

    public string? Password { get; set; }

    public string Database { get; set; } = string.Empty;

    public int Port { get; set; } = 5432;

    public bool UseSqlite { get; set; }

    public string SqliteDbPath { get; set; } = "./database.db";

    public bool UseTokenAuth { get; set; } = true;
    public bool UseSystemIdentityIfPresent { get; set; } = true;

    public bool EnableSensitiveDataLogging { get; set; } = false;

    public bool UseAnyTokenAuth => (UseTokenAuth || UseSystemIdentityIfPresent) && !UseSqlite;
    public bool UseSystemIdentity => !string.IsNullOrEmpty(_systemIdentityName) && UseSystemIdentityIfPresent;
    public string GetUsername => UseSystemIdentity && _systemIdentityName is not null ? _systemIdentityName : Username;

    public string ConnectionString()
    {
        return $"Host={Host};Port={Port};Database={Database};Username={GetUsername};Password={Password}";
    }
}