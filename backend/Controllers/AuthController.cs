using System;
using System.Threading.Tasks;
using backend.DTOs;
using backend.Mappers;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly JWTService _jwtService;

  public AuthController(AuthService authService, JWTService jwtService)
  {
    _authService = authService;
    _jwtService = jwtService;
  }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserDTO registerUserDTO)
    {
        try
        {

            var user = await _authService.Register(registerUserDTO);
            return CreatedAtAction(nameof(Register), new { id = user.Id }, user.ToDTO());
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginUserDTO loginUserDTO)
    {
        var user = await _authService.Login(loginUserDTO);

        if (user == null)
        {
            return Unauthorized("Invalid credentials");
        }

        var token = _jwtService.GenerateJWTToken(user.Username);
        return Ok(new { token });
    }
}
