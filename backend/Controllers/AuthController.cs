using backend.Dtos;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/users")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly JwtService _jwtService;

    public AuthController(AuthService authService, JwtService jwtService)
    {
        _authService = authService;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> RegisterUserAsync(
        [FromBody] RegisterUserDto registerUserDto,
        CancellationToken ct
    )
    {
        var user = await _authService.RegisterUserAsync(registerUserDto, ct);
        return Ok(user);
        ;
    }

    [HttpPost("login")]
    public async Task<IActionResult> LoginUserAsync(
        [FromBody] LoginUserDto loginUserDto,
        CancellationToken ct
    )
    {
        var user = await _authService.LoginUserAsync(loginUserDto, ct);

        if (user == null)
        {
            return Unauthorized("Invalid credentials");
        }

        var token = _jwtService.GenerateJwtToken(user);
        return Ok(new { token });
    }
}
