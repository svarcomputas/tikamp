using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;
using Tikamp.Database.Models;
using Tikamp.Database.Repositories;

namespace Tikamp.Api.Services;

public class UserService(TikampRepository repository)
{
    public async Task<User> GetOrCreateUserAsync(ClaimsPrincipal claims, CancellationToken cancellationToken)
    {
        var oid = claims.GetObjectId();
        if (string.IsNullOrEmpty(oid)) throw new ArgumentException("user is null");

        var user = await repository.Users.FirstOrDefaultAsync(u => u.Id == oid, cancellationToken);
        if (user is not null) return user;

        user = new User
        {
            Id = oid,
            Name = claims.FindFirstValue(ClaimConstants.Name) ?? "Default name"
        };
        await repository.Users.AddAsync(user, cancellationToken);
        await repository.Save(cancellationToken);
        return user;
    }
}