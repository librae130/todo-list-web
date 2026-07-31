using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class LoginUserDTO
{
    [Required]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Password { get; set; } = string.Empty;
}
