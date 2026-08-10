using System;
using System.Threading.Tasks;
using backend.Dtos;
using backend.Mappers;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/users")]
public class AuthController : ControllerBase
{
  private readonly AuthService _authService;
  private readonly JWTService _jwtService;

  internal AuthController(AuthService authService, JWTService jwtService)
  {
    _authService = authService;
    _jwtService = jwtService;
  }

  [HttpPost("register")]
  public async Task<IActionResult> RegisterUserAsync(
      [FromBody] RegisterUserDto registerUserDto,
      CancellationToken cancellationToken
  )
  {
    var user = await _authService.RegisterUserAsync(registerUserDto, cancellationToken);
    return CreatedAtAction(nameof(RegisterUserAsync), new { id = user.Id }, user);
  }

  [HttpPost("login")]
  public async Task<IActionResult> LoginUserAsync(
      [FromBody] LoginUserDto loginUserDto,
      CancellationToken cancellationToken
  )
  {
    var user = await _authService.LoginUserAsync(loginUserDto, cancellationToken);

    if (user == null)
    {
      return Unauthorized("Invalid credentials");
    }

    var token = _jwtService.GenerateJWTToken(user);
    return Ok(new { token });
  }
}
