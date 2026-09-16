using backend.Dtos;
using backend.Options;

namespace backend.Helpers;

internal static class CookieHelper
{
    public static void AppendAuthCookies(
        HttpResponse response,
        AuthResultDto authResult,
        JwtOptions jwtOptions
    )
    {
        response.Cookies.Append(
            "accessToken",
            authResult.AccessToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddMinutes(
                    jwtOptions.AccessTokenDurationInMinute
                ),
            }
        );

        response.Cookies.Append(
            "refreshToken",
            authResult.RefreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/api/auth/refresh",
                Expires = DateTimeOffset.UtcNow.AddDays(jwtOptions.RefreshTokenDurationInDay),
            }
        );
    }
}
