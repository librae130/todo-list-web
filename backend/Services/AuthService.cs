using backend.Dtos;
using backend.Entities;
using backend.Mappers;
using backend.Repositories;

namespace backend.Services;

public class AuthService
{
    private readonly IUserRepository _repo;

    public AuthService(IUserRepository repo)
    {
        _repo = repo;
    }

    public async Task<UserDto> RegisterUserAsync(
        RegisterUserDto registerUserDto,
        CancellationToken ct
    )
    {
        var existingUser = await _repo.FirstOrDefaultAsync(
            u => u.Username == registerUserDto.Username,
            ct
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

        await _repo.AddAsync(user);
        await _repo.SaveAsync(ct);

        return user.ToDto();
    }

    public async Task<UserDto?> LoginUserAsync(
        LoginUserDto loginUserDto,
        CancellationToken ct
    )
    {
        var user = await _repo.FirstOrDefaultAsync(
            u => u.Username == loginUserDto.Username,
            ct
        );

        if (user == null || !BCrypt.Net.BCrypt.Verify(loginUserDto.Password, user.PasswordHash))
        {
            return null;
        }

        return user.ToDto();
    }
}
