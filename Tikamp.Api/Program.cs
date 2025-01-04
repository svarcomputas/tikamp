using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.SwaggerGen;
using Tikamp.Api.Config;
using Tikamp.Api.Services;
using Tikamp.Database.Configuration;
using Tikamp.Dto;
using Tikamp.Utilities;
using Tikamp.Utilities.Authentication;
using Tikamp.Utilities.OpenApi;

var builder = WebApplication.CreateBuilder(args).AddConfiguration();
builder.Services.AddControllers();
builder.Services
       .AddDatabase(builder.Configuration)
       .AddTransient<ActivitiesServices>()
       .AddTransient<UserActivityService>()
       .AddTransient<UserService>()
       .AddTransient<LeaderboardService>()
       .AddScoped<AbstractValidator<PutActivityDto>, PutActivityDtoValidator>()
       .AddScoped<AbstractValidator<PutUserActivityDto>, PutUserActivityDtoValidator>()
       .AddTransient<ValidationService>()
       .AddSwaggerGen()
       .AddCorsPolicies(builder.Configuration)
       .AddTransient<IConfigureOptions<SwaggerGenOptions>, ConfigureSwaggerOptions>()
       .AddAuth(builder.Configuration);

var app = builder.Build().EnsureDatabase();
app.UseCors(); // Cors må komme tidlig o pipelinen
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.EnableSwaggerUi();
app.UseEndpoints(
    endpoints =>
    {
        var endpointBuilder = endpoints.MapControllers();
        var authConfig = app.Services.GetRequiredService<IOptions<AuthOptions>>();
        if (authConfig.Value.Enabled == false) endpointBuilder.WithMetadata(new AllowAnonymousAttribute());
    });
if (!app.Environment.IsDevelopment()) app.UseHsts();

app.Run();