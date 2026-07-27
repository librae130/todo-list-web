using System;
using System.Threading.Tasks;
using backend.DTOs;
using backend.Mappers;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/users")]
public class AuthController : ControllerBase
{
    private readonly UserService _userService;
    private readonly JWTService _jwtService;

    public AuthController(UserService userService, JWTService jwtService)
    {
        _userService = userService;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserDTO registerUserDTO)
    {
        try
        {
            var user = await _userService.Register(registerUserDTO);
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
        var user = await _userService.Login(loginUserDTO);

        if (user == null)
        {
            return Unauthorized("Invalid credentials");
        }

        var token = _jwtService.GenerateJWTToken(user.Username);
        return Ok(new { token });
    }
}
