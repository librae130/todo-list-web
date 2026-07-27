using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Todo
{
  [Key]
  public Guid Id { get; set; }
  public string Name { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  public DateTime CreatedAt { get; set; }
}
