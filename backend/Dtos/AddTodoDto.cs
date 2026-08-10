using System.ComponentModel.DataAnnotations;

namespace backend.Dtos;

public class AddTodoDto
{
    [Required]
    [StringLength(100, ErrorMessage = "Name cannot be longer than 100 characters.")]
    public string Name { get; set; } = string.Empty;

    [StringLength(500, ErrorMessage = "Description cannot be longer than 500 characters.")]
    public string Description { get; set; } = string.Empty;
}
