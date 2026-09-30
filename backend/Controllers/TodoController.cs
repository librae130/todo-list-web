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

    public TodoController(TodoService todoService)
    {
        _todoService = todoService;
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
        TodoDto? updatedTodo = await _todoService.UpdateTodoAsync( id, updateTodoDto, ct);

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
