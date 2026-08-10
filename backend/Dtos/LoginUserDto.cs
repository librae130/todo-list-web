using System.ComponentModel.DataAnnotations;

namespace backend.Dtos;

public class LoginUserDto
{
    [Required]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Password { get; set; } = string.Empty;
}
