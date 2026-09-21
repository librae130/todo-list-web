using System.ComponentModel.DataAnnotations;

namespace backend.Dtos;

public class RegisterUserDto
{
    [Required]
    [StringLength(50, ErrorMessage = "Username cannot be longer than 50 characters.")]
    public string Username { get; set; } = string.Empty;

    [Required]
    [StringLength(
        50,
        MinimumLength = 8,
        ErrorMessage = "Password must be between 8 and 50 characters."
    )]
    public string Password { get; set; } = string.Empty;
}
