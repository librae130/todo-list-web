namespace backend.Options;

public class JwtOptions
{
  public static string Section = "Jwt";
  public string Key { get; set; } = string.Empty;
  public string Issuer { get; set; } = string.Empty;
  public string Audience { get; set; } = string.Empty;
  public int AccessTokenDurationInMinute { get; set; }
  public int RefreshTokenDurationInDay { get; set; }
}
