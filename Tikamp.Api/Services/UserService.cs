using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Web;
using Tikamp.Database.Models;
using Tikamp.Database.Repositories;
using Tikamp.Utilities.Authentication;

namespace Tikamp.Api.Services;

public class UserService(TikampRepository repository, IOptions<AuthOptions> authOptions)
{
    public async Task<User> GetOrCreateUserAsync(ClaimsPrincipal claims, CancellationToken cancellationToken)
    {
        var oid = claims.GetObjectId();
        if (string.IsNullOrEmpty(oid)) throw new ArgumentException("user is null");

        var user = await repository.Users.FirstOrDefaultAsync(u => u.Id == oid, cancellationToken);
        if (user is not null) return user;

        user = await repository.Users.FirstOrDefaultAsync(u => u.UserEmail == claims.GetEmail(), cancellationToken);
        user = await (user is not null
                          ? HandleUserMigration(claims, user, oid, cancellationToken)
                          : CreateUser(claims, oid, cancellationToken));
        await repository.Save(cancellationToken);
        ;
        return user;
    }

    private async Task<User> HandleUserMigration(ClaimsPrincipal claims, User existingUser, string oid, CancellationToken cancellationToken)
    {
        var registeredActivity = await repository.UserActivities.Where(ua => ua.UserId == existingUser.Id).ToListAsync(cancellationToken);
        if (registeredActivity.Any()) repository.UserActivities.RemoveRange(registeredActivity);
        repository.Users.Remove(existingUser);

        var newUser = await CreateUser(claims, oid, cancellationToken);
        var newActivities = registeredActivity.Select(ua => new UserActivity
        {
            Month = ua.Month,
            Id = Guid.NewGuid(),
            UserId = newUser.Id,
            Quantity = ua.Quantity,
            Day = ua.Day
        });

        repository.UserActivities.AddRange(newActivities);
        return newUser;
    }

    private async Task<User> CreateUser(ClaimsPrincipal claims, string oid, CancellationToken cancellationToken)
    {
        var tenantId = claims.GetTenantId();
        var isComputasUser = tenantId == authOptions.Value.ComputasTenant;
        var user = new User
        {
            Id = oid,
            Name = (claims.FindFirstValue(ClaimConstants.Name) ?? "Default name") + (isComputasUser ? "" : " (Ekstern)"),
            UserEmail = claims.GetEmail(),
        };
        await repository.Users.AddAsync(user, cancellationToken);
        return user;
    }
}