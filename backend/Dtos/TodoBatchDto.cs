using System.ComponentModel.DataAnnotations;

namespace backend.Dtos;

public class TodoBatchRequestDto
{
  public const int MaxOperations = 100;

  [Required]
  [MaxLength(MaxOperations)]
  public List<TodoBatchOperationDto> Operations { get; set; } = [];
}

public class TodoBatchOperationDto
{
  public string ClientId { get; set; } = string.Empty;
  public string Action { get; set; } = string.Empty;
  public Guid? TodoId { get; set; }
  public string? Name { get; set; }
  public string? Description { get; set; }
}

public class TodoBatchOperationResultDto
{
  public string ClientId { get; set; } = string.Empty;
  public string Action { get; set; } = string.Empty;
  public bool IsSucceeded { get; set; }
  public string ErrorMessage { get; set; } = string.Empty;
  public TodoDto? Todo { get; set; }
  public Guid? TodoId { get; set; }
}
