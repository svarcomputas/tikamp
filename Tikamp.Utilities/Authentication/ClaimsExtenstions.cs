using System.Security.Claims;

namespace Tikamp.Utilities.Authentication;

public static class ClaimsExtenstions
{
    public static string GetEmail(this ClaimsPrincipal claims)
    {
        return claims.FindFirstValue("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress") ?? "no-email";
    }
}