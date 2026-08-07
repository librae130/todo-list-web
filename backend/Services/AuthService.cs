using backend.Data;
using backend.DTOs;
using backend.Mappers;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class AuthService
{
    private readonly ApplicationDBContext _context;

    public AuthService(ApplicationDBContext context)
    {
        _context = context;
    }

    public async Task<UserDTO> RegisterUserAsync(
        RegisterUserDTO registerUserDTO,
        CancellationToken cancellationToken
    )
    {
        var existingUser = await _context.Users.FirstOrDefaultAsync(
            u => u.Username == registerUserDTO.Username,
            cancellationToken
        );
        if (existingUser != null)
        {
            throw new Exception("Username already exists");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = registerUserDTO.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerUserDTO.Password),
            CreatedAt = DateTime.UtcNow,
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        return user.ToDTO();
    }

    public async Task<UserDTO?> LoginUserAsync(LoginUserDTO loginUserDTO, CancellationToken cancellationToken)
    {
        var user = await _context.Users.FirstOrDefaultAsync(
            u => u.Username == loginUserDTO.Username,
            cancellationToken
        );

        if (user == null || !BCrypt.Net.BCrypt.Verify(loginUserDTO.Password, user.PasswordHash))
        {
            return null;
        }

        return user.ToDTO();
    }
}
