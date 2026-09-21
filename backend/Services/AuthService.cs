using AutoMapper;
using backend.Data;
using backend.Dtos;
using backend.Entities;
using backend.Options;
using backend.Repositories;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace backend.Services;

public class AuthService
{
  private readonly TokenService _tokenService;
  private readonly IGenericRepository<RefreshToken> _refreshTokenRepo;
  private readonly IGenericRepository<User> _userRepo;
  private readonly IMapper _mapper;
  private readonly JwtOptions _jwtOptions;
  private readonly ILogger<AuthService> _logger;

  public AuthService(
      TokenService tokenService,
      IUnitOfWork unitOfWork,
      IMapper mapper,
      IOptions<JwtOptions> jwtOptions,
      ILogger<AuthService> logger
  )
  {
    _tokenService = tokenService;
    _refreshTokenRepo = unitOfWork.GetRepository<RefreshToken>();
    _userRepo = unitOfWork.GetRepository<User>();
    _mapper = mapper;
    _jwtOptions = jwtOptions.Value;
    _logger = logger;
  }

  private async Task<AuthResultDto?> AddRefreshTokenForUserAsync(
      UserDto userDto,
      CancellationToken ct = default
  )
  {
    string newAccessToken = _tokenService.GenerateJwtToken(userDto);
    string newRefreshTokenString = _tokenService.GenerateRefreshToken();

    RefreshToken newRefreshTokenEntity = new RefreshToken
    {
      Token = newRefreshTokenString,
      UserId = userDto.Id,
      ExpiresAtUtc = DateTime.UtcNow.AddDays(_jwtOptions.RefreshTokenDurationInDay),
      CreatedAt = DateTime.UtcNow,
    };

    await _refreshTokenRepo.AddAsync(newRefreshTokenEntity, ct);
    await _refreshTokenRepo.SaveAsync(ct);

    return new AuthResultDto
    {
      AccessToken = newAccessToken,
      RefreshToken = newRefreshTokenString,
      User = userDto,
    };
  }

  public async Task<UserDto?> RegisterUserAsync(
      RegisterUserDto registerUserDto,
      CancellationToken ct = default
  )
  {
    User? existingUser = await _userRepo.FirstOrDefaultAsync(
        u => u.Username == registerUserDto.Username,
        ct
    );

    if (existingUser != null)
    {
      _logger.LogWarning("Registration rejected because username already exists: {Username}", registerUserDto.Username);
      return null;
    }

    User user = new User
    {
      Username = registerUserDto.Username,
      PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerUserDto.Password),
      CreatedAt = DateTime.UtcNow,
    };

    await _userRepo.AddAsync(user);
    await _userRepo.SaveAsync(ct);

    _logger.LogInformation("User registered: {UserId}", user.Id);

    return _mapper.Map<UserDto>(user);
  }

  public async Task<AuthResultDto?> LoginUserAsync(
      LoginUserDto loginUserDto,
      CancellationToken ct = default
  )
  {
    User? user = await _userRepo.FirstOrDefaultAsync(
        u => u.Username == loginUserDto.Username,
        ct
    );

    if (user == null || !BCrypt.Net.BCrypt.Verify(loginUserDto.Password, user.PasswordHash))
    {
      _logger.LogWarning("Login failed for username: {Username}", loginUserDto.Username);
      return null;
    }

    _logger.LogInformation("User logged in: {UserId}", user.Id);

    return await AddRefreshTokenForUserAsync(_mapper.Map<UserDto>(user), ct);
  }

  public async Task<AuthResultDto?> RefreshTokenAsync(
      string refreshToken,
      CancellationToken ct = default
  )
  {
    RefreshToken? foundRefreshToken = await _refreshTokenRepo.FirstOrDefaultAsync(
        x => x.Token == refreshToken,
        ct
    );

    if (foundRefreshToken == null)
    {
      _logger.LogWarning("Refresh failed because the refresh token was not found");
      return null;
    }

    if (foundRefreshToken.ExpiresAtUtc <= DateTime.UtcNow)
    {
      _refreshTokenRepo.Remove(foundRefreshToken);
      await _refreshTokenRepo.SaveAsync(ct);
      _logger.LogWarning("Refresh failed because the refresh token expired");
      return null;
    }

    User? user = await _userRepo.GetByIdAsync(foundRefreshToken.UserId);
    AuthResultDto? refreshResult = await AddRefreshTokenForUserAsync(
        _mapper.Map<UserDto>(user),
        ct
    );

    _refreshTokenRepo.Remove(foundRefreshToken);
    await _refreshTokenRepo.SaveAsync(ct);

    _logger.LogInformation("Access token refreshed for user: {UserId}", foundRefreshToken.UserId);

    return refreshResult;
  }

  public async Task<bool> RemoveRefreshTokenAsync(
      string refreshToken,
      CancellationToken ct = default
  )
  {
    RefreshToken? foundRefreshToken = await _refreshTokenRepo.FirstOrDefaultAsync(
        x => x.Token == refreshToken,
        ct
    );

    if (foundRefreshToken == null)
    {
      return false;
    }

    _refreshTokenRepo.Remove(foundRefreshToken);
    await _refreshTokenRepo.SaveAsync(ct);
    _logger.LogInformation("User logged out: {UserId}", foundRefreshToken.UserId);
    return true;
  }
}
