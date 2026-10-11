using backend.Dtos;
using backend.Helpers;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Authorize]
[Route("api/todos")]
public class TodoController : ControllerBase
{
  private readonly TodoService _todoService;
  private readonly TodoBatchService _todoBatchService;

  public TodoController(TodoService todoService, TodoBatchService todoBatchService)
  {
    _todoService = todoService;
    _todoBatchService = todoBatchService;
  }

  [HttpGet]
  public async Task<IActionResult> GetAllTodosAsync(CancellationToken ct)
  {
    Guid userId = AccessTokenParser.GetCurrentUserId(User);
    List<TodoDto> todos = await _todoService.GetAllTodosAsync(userId, ct);
    return Ok(todos);
  }

  [HttpGet("{id}", Name = "GetTodoByIdAsync")]
  public async Task<IActionResult> GetTodoByIdAsync([FromRoute] Guid id, CancellationToken ct)
  {
    TodoDto? foundTodo = await _todoService.GetTodoByIdAsync(id, ct);

    if (foundTodo == null)
    {
      return NotFound($"To-do with id {id} not found");
    }

    return Ok(foundTodo);
  }

  [HttpPost]
  public async Task<IActionResult> AddTodoAsync(
      [FromBody] AddTodoDto addTodoDto,
      CancellationToken ct
  )
  {
    Guid userId = AccessTokenParser.GetCurrentUserId(User);
    TodoDto addedTodo = await _todoService.AddTodoAsync(userId, addTodoDto, ct);
    return CreatedAtRoute("GetTodoByIdAsync", new { id = addedTodo.Id }, addedTodo);
  }

  [HttpPost("batch")]
  public async Task<IActionResult> ApplyTodoBatchAsync(
      [FromBody] TodoBatchRequestDto request,
      CancellationToken ct
  )
  {
    if (request.Operations == null)
    {
      return BadRequest("Operations are required.");
    }

    if (request.Operations.Count > TodoBatchRequestDto.MaxOperations)
    {
      return BadRequest($"A batch cannot contain more than {TodoBatchRequestDto.MaxOperations} operations.");
    }

    if (request.Operations.Any(operation => operation == null || string.IsNullOrWhiteSpace(operation.ClientId)))
    {
      return BadRequest("Each operation must have a clientId.");
    }

    Guid userId = AccessTokenParser.GetCurrentUserId(User);
    List<TodoBatchOperationResultDto> results = await _todoBatchService.ApplyTodoBatchAsync(
        userId,
        request,
        ct
    );
    return Ok(results);
  }

  [HttpPost("search")]
  public async Task<IActionResult> SearchTodosAsync(
      [FromBody] SearchTodoDto searchTodoDto,
      CancellationToken ct
  )
  {
    Guid userId = AccessTokenParser.GetCurrentUserId(User);
    List<TodoDto> todos = await _todoService.SearchTodosAsync(userId, searchTodoDto, ct);
    return Ok(todos);
  }

  [HttpPut("{id}")]
  public async Task<IActionResult> UpdateTodoAsync(
      [FromRoute] Guid id,
      [FromBody] UpdateTodoDto updateTodoDto,
      CancellationToken ct
  )
  {
    TodoDto? updatedTodo = await _todoService.UpdateTodoAsync(id, updateTodoDto, ct);

    if (updatedTodo == null)
    {
      return NotFound($"To-do with id {id} not found");
    }

    return Ok(updatedTodo);
  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> RemoveTodoAsync([FromRoute] Guid id, CancellationToken ct)
  {
    bool deleted = await _todoService.RemoveTodoAsync(id, ct);

    if (!deleted)
    {
      return NotFound($"To-do with id {id} not found");
    }

    return NoContent();
  }
}
