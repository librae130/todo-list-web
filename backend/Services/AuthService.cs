using AutoMapper;
using backend.Data;
using backend.Dtos;
using backend.Entities;

namespace backend.Services;

public class AuthService
{
    private readonly TokenService _tokenService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AuthService(TokenService tokenService, IUnitOfWork unitOfWork, IMapper mapper)
    {
        _tokenService = tokenService;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    private async Task<AuthResultDto?> AddRefreshTokenForUserAsync(
        UserDto userDto,
        CancellationToken ct
    )
    {
        var newAccessToken = _tokenService.GenerateJwtToken(userDto);
        var newRefreshTokenString = _tokenService.GenerateRefreshToken();

        var newRefreshTokenEntity = new RefreshToken
        {
            Token = newRefreshTokenString,
            UserId = userDto.Id,
            ExpiresAtUtc = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow,
        };

        await _unitOfWork.GetRepository<RefreshToken>().AddAsync(newRefreshTokenEntity, ct);
        await _unitOfWork.SaveAsync(ct);

        return new AuthResultDto
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshTokenString,
            User = userDto,
        };
    }

    public async Task<UserDto> RegisterUserAsync(
        RegisterUserDto registerUserDto,
        CancellationToken ct
    )
    {
        var existingUser = await _unitOfWork
            .GetRepository<User>()
            .FirstOrDefaultAsync(u => u.Username == registerUserDto.Username, ct);

        if (existingUser != null)
        {
            throw new Exception("Username already exists");
        }

        var user = new User
        {
            Username = registerUserDto.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerUserDto.Password),
            CreatedAt = DateTime.UtcNow,
        };

        await _unitOfWork.GetRepository<User>().AddAsync(user);
        await _unitOfWork.SaveAsync(ct);

        return _mapper.Map<UserDto>(user);
    }

    public async Task<AuthResultDto?> LoginUserAsync(
        LoginUserDto loginUserDto,
        CancellationToken ct
    )
    {
        var user = await _unitOfWork
            .GetRepository<User>()
            .FirstOrDefaultAsync(u => u.Username == loginUserDto.Username, ct);

        if (user == null || !BCrypt.Net.BCrypt.Verify(loginUserDto.Password, user.PasswordHash))
        {
            return null;
        }

        return await AddRefreshTokenForUserAsync(_mapper.Map<UserDto>(user), ct);
    }

    public async Task<AuthResultDto?> RefreshTokenAsync(string refreshToken, CancellationToken ct)
    {
        var foundRefreshToken = await _unitOfWork
            .GetRepository<RefreshToken>()
            .FirstOrDefaultAsync(x => x.Token == refreshToken, ct);

        if (foundRefreshToken == null || foundRefreshToken.ExpiresAtUtc <= DateTime.UtcNow)
        {
            return null;
        }

        var user = await _unitOfWork.GetRepository<User>().GetByIdAsync(foundRefreshToken.UserId);
        var refreshResult = await AddRefreshTokenForUserAsync(_mapper.Map<UserDto>(user), ct);

        _unitOfWork.GetRepository<RefreshToken>().Remove(foundRefreshToken);
        await _unitOfWork.SaveAsync();

        return refreshResult;
    }
}
