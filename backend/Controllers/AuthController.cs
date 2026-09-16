using backend.Dtos;
using backend.Helpers;
using backend.Options;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly JwtOptions _jwtOptions;

    public AuthController(AuthService authService, IOptions<JwtOptions> jwtOptions)
    {
        _authService = authService;
        _jwtOptions = jwtOptions.Value;
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

        CookieHelper.AppendAuthCookies(Response, authResult, _jwtOptions);

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

        CookieHelper.AppendAuthCookies(Response, authResult, _jwtOptions);

        return Ok(authResult);
    }
}
