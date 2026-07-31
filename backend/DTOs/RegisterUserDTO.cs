using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class RegisterUserDTO
{
    [Required]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    [MaxLength(50)]
    public string Password { get; set; } = string.Empty;
}
