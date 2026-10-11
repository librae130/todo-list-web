using System.ComponentModel.DataAnnotations;

namespace backend.Dtos;

public class LoginUserDto
{
  [Required]
  [StringLength(50, ErrorMessage = "Username cannot be longer than 50 characters.")]
  public string Username { get; set; } = string.Empty;

  [Required]
  [StringLength(256, ErrorMessage = "Password cannot be longer than 256 characters.")]
  public string Password { get; set; } = string.Empty;
}
