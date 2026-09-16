using backend.Dtos;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> RegisterUserAsync(
        [FromBody] RegisterUserDto registerUserDto,
        CancellationToken ct
    )
    {
        await _authService.RegisterUserAsync(registerUserDto, ct);
        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> LoginUserAsync(
        [FromBody] LoginUserDto loginUserDto,
        CancellationToken ct
    )
    {
        AuthResultDto? authResult = await _authService.LoginUserAsync(loginUserDto, ct);

        if (authResult == null)
        {
            return Unauthorized("Invalid credentials");
        }

        Response.Cookies.Append(
            "accessToken",
            authResult.AccessToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddDays(7),
            }
        );

        Response.Cookies.Append(
            "refreshToken",
            authResult.RefreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/api/auth/refresh",
                Expires = DateTimeOffset.UtcNow.AddDays(7),
            }
        );

        return Ok();
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshTokenAsync(CancellationToken ct)
    {
        if (!Request.Cookies.TryGetValue("refreshToken", out string? refreshToken))
        {
            return Unauthorized("No refresh token found.");
        }

        AuthResultDto? authResult = await _authService.RefreshTokenAsync(refreshToken, ct);

        if (authResult == null)
        {
            return Unauthorized("Failed to renew refresh token");
        }

        Response.Cookies.Append(
            "accessToken",
            authResult.AccessToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddDays(7),
            }
        );

        Response.Cookies.Append(
            "refreshToken",
            authResult.RefreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/api/auth/refresh",
                Expires = DateTimeOffset.UtcNow.AddDays(7),
            }
        );

        return Ok(authResult);
    }
}
