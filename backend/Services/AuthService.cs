using backend.Data;
using backend.Dtos;
using backend.Mappers;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

internal class AuthService
{
    private readonly ApplicationDBContext _context;

    public AuthService(ApplicationDBContext context)
    {
        _context = context;
    }

    public async Task<UserDto> RegisterUserAsync(
        RegisterUserDto registerUserDto,
        CancellationToken cancellationToken
    )
    {
        var existingUser = await _context.Users.FirstOrDefaultAsync(
            u => u.Username == registerUserDto.Username,
            cancellationToken
        );
        if (existingUser != null)
        {
            throw new Exception("Username already exists");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = registerUserDto.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerUserDto.Password),
            CreatedAt = DateTime.UtcNow,
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        return user.ToDto();
    }

    public async Task<UserDto?> LoginUserAsync(LoginUserDto loginUserDto, CancellationToken cancellationToken)
    {
        var user = await _context.Users.FirstOrDefaultAsync(
            u => u.Username == loginUserDto.Username,
            cancellationToken
        );

        if (user == null || !BCrypt.Net.BCrypt.Verify(loginUserDto.Password, user.PasswordHash))
        {
            return null;
        }

        return user.ToDto();
    }
}
