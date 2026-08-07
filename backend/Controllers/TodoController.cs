using System.Security.Claims;
using backend.DTOs;
using backend.Mappers;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Authorize]
[Route("api/todo-list")]
public class TodoController : ControllerBase
{
    private readonly TodoService _todoService;

    public TodoController(TodoService todoService)
    {
        _todoService = todoService;
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            throw new UnauthorizedAccessException("User ID not found in token.");
        }

        return Guid.Parse(userIdClaim.Value);
    }

    [HttpGet]
    public async Task<IActionResult> GetTodoListAsync(CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        var todos = await _todoService.GetTodoListAsync(userId, cancellationToken);
        return Ok(todos);
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchTodoListAsync(
        [FromQuery] string? search,
        [FromQuery] string? filter,
        CancellationToken cancellationToken
    )
    {
        var userId = GetCurrentUserId();
        var todos = await _todoService.SearchTodoListAsync(userId, search, filter, cancellationToken);
        return Ok(todos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTodoByIdAsync(
        [FromRoute] Guid id,
        CancellationToken cancellationToken
    )
    {
        var userId = GetCurrentUserId();

        var foundTodo = await _todoService.GetTodoByIdAsync(id, userId, cancellationToken);

        if (foundTodo == null)
        {
            return NotFound($"To-do with id {id} of user with id {userId} not found");
        }

        return Ok(foundTodo);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTodoAsync(
        [FromBody] CreateTodoDTO createTodoDTO,
        CancellationToken cancellationToken
    )
    {
        var userId = GetCurrentUserId();

        var createdTodo = await _todoService.CreateTodoAsync(createTodoDTO, userId, cancellationToken);

        return CreatedAtAction(nameof(GetTodoByIdAsync), new { id = createdTodo.Id }, createdTodo);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTodoAsync(
        [FromRoute] Guid id,
        [FromBody] UpdateTodoDTO updateTodoDTO,
        CancellationToken cancellationToken
    )
    {
        var userId = GetCurrentUserId();

        var updatedTodo = await _todoService.UpdateTodoAsync(id, updateTodoDTO, userId, cancellationToken);

        if (updatedTodo == null)
        {
            return NotFound($"To-do with id {id} of user with id {userId} not found");
        }

        return Ok(updatedTodo);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTodoAsync(
        [FromRoute] Guid id,
        CancellationToken cancellationToken
    )
  {
        var userId = GetCurrentUserId();
      
        var deleted = await _todoService.DeleteTodoAsync(id, userId, cancellationToken);

        if (!deleted)
        {
            return NotFound($"To-do with id {id} of user with id {userId} not found");
        }

        return NoContent();
    }
}
