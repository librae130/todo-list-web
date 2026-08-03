using backend.DTOs;
using backend.Mappers;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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
    public async Task<IActionResult> GetList()
  {
      var userId = GetCurrentUserId();
        var todos = await _todoService.GetList(userId);
        return Ok(todos.Select(todo => todo.ToDTO()));
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchList(
        [FromQuery] string? search,
        [FromQuery] string? filter
    )
  {
      var userId = GetCurrentUserId();
        var todos = await _todoService.SearchList(userId,search, filter);
        return Ok(todos.Select(todo => todo.ToDTO()));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById([FromRoute] Guid id)
    {
        var foundTodo = await _todoService.GetById(id);

        if (foundTodo == null)
        {
            return NotFound($"To-do with id {id} not found");
        }

        return Ok(foundTodo.ToDTO());
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTodoDTO createTodoDTO)
    {
        var createdTodo = await _todoService.Create(createTodoDTO);

        return CreatedAtAction(nameof(GetById), new { id = createdTodo.Id }, createdTodo.ToDTO());
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        [FromRoute] Guid id,
        [FromBody] UpdateTodoDTO updateTodoDTO
    )
    {
        var updatedTodo = await _todoService.Update(id, updateTodoDTO);

        if (updatedTodo == null)
        {
            return NotFound($"To-do with id {id} not found");
        }

        return Ok(updatedTodo.ToDTO());
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete([FromRoute] Guid id)
    {
        var deleted = await _todoService.Delete(id);

        if (!deleted)
        {
            return NotFound($"To-do with id {id} not found");
        }

        return NoContent();
    }
}
