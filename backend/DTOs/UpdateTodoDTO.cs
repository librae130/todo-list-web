using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class UpdateTodoDTO
{
    [StringLength(100, ErrorMessage = "Name cannot be longer than 100 characters.")]
    public string Name { get; set; } = string.Empty;

    [StringLength(500, ErrorMessage = "Description cannot be longer than 500 characters.")]
    public string Description { get; set; } = string.Empty;
}
