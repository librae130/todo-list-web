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
<<<<<<< HEAD
    private readonly AuthService _authService;
    private readonly JWTService _jwtService;

    public AuthController(AuthService authService, JWTService jwtService)
    {
        _authService = authService;
=======
    private readonly UserService _userService;
    private readonly JWTService _jwtService;

    public AuthController(UserService userService, JWTService jwtService)
    {
        _userService = userService;
>>>>>>> ce32cc9 (initial)
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserDTO registerUserDTO)
    {
        try
        {
<<<<<<< HEAD
            var user = await _authService.Register(registerUserDTO);
=======
            var user = await _userService.Register(registerUserDTO);
>>>>>>> ce32cc9 (initial)
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
<<<<<<< HEAD
        var user = await _authService.Login(loginUserDTO);
=======
        var user = await _userService.Login(loginUserDTO);
>>>>>>> ce32cc9 (initial)

        if (user == null)
        {
            return Unauthorized("Invalid credentials");
        }

        var token = _jwtService.GenerateJWTToken(user.Username);
        return Ok(new { token });
    }
}
