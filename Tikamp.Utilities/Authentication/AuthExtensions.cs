using Microsoft.AspNetCore.Authorization;

namespace Tikamp.Utilities.Authentication;

public class RolesAuthorizeAttribute : AuthorizeAttribute
{
    public RolesAuthorizeAttribute(params string[] roles)
    {
        Roles = string.Join(",", roles);
    }
}