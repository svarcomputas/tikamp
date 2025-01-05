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

        var tenantId = claims.GetTenantId();
        var isComputasUser = tenantId == authOptions.Value.AzureAd?.TenantId;
        user = new User
        {
            Id = oid,
            Name = (claims.FindFirstValue(ClaimConstants.Name) ?? "Default name") + (isComputasUser ? "" : " (Ekstern)")
        };
        await repository.Users.AddAsync(user, cancellationToken);
        await repository.Save(cancellationToken);
        return user;
    }
}