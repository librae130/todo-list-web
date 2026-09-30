using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using backend.Dtos;
using backend.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;

namespace backend.Services;

public class TokenService
{
  private readonly JwtOptions _jwtOptions;
  private readonly ILogger<TokenService> _logger;

  public TokenService(IOptions<JwtOptions> jwtOptions, ILogger<TokenService> logger)
  {
    _jwtOptions = jwtOptions.Value;
    _logger = logger;
  }

  public string GenerateJwtToken(UserDto user)
  {
    Claim[] claims = new[] { new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()) };

    SymmetricSecurityKey key = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(_jwtOptions.Key)
    );
    SigningCredentials credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    JwtSecurityToken token = new JwtSecurityToken(
        issuer: _jwtOptions.Issuer,
        audience: _jwtOptions.Audience,
        claims: claims,
        expires: DateTime.UtcNow.AddMinutes(_jwtOptions.AccessTokenDurationInMinute),
        signingCredentials: credentials
    );

    string accessToken = new JwtSecurityTokenHandler().WriteToken(token);
    _logger.LogDebug("Access token generated for user: {UserId}", user.Id);
    return accessToken;
  }

  public string GenerateRefreshToken()
  {
    string refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
    _logger.LogDebug("Refresh token generated");
    return refreshToken;
  }
}
