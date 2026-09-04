namespace backend.Entities;

public class RefreshToken
{
    public Guid Id { get; set; }
    public string Token { get; set; } = string.Empty;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public DateTime ExpiresAtUtc { get; set; }
    public DateTime CreatedAt { get; set; }
}
