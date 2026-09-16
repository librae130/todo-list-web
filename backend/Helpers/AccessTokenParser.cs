using System.Security.Claims;

namespace backend.Helpers;

internal static class AccessTokenParser
{
    public static Guid GetCurrentUserId(ClaimsPrincipal user)
    {
        Claim? userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            throw new UnauthorizedAccessException("User ID not found in token.");
        }

        return Guid.Parse(userIdClaim.Value);
    }
}
