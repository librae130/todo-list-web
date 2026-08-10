using System.ComponentModel.DataAnnotations;

namespace backend.Dtos;

public class RegisterUserDto
{
    [Required]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    [MaxLength(50)]
    public string Password { get; set; } = string.Empty;
}
