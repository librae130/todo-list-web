using backend.DTOs;
using backend.Mappers;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/todo-list")]
public class TodoController : ControllerBase
{
    private readonly TodoService _todoService;

    public TodoController(TodoService todoService)
    {
        _todoService = todoService;
    }

    [HttpGet]
    public async Task<IActionResult> GetList()
    {
        var todos = await _todoService.GetList();
        return Ok(todos.Select(todo => todo.ToDTO()));
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchList(
        [FromQuery] string? search,
        [FromQuery] string? filter
    )
    {
        var todos = await _todoService.SearchList(search, filter);
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
    public async Task<IActionResult> Create(CreateTodoDTO createTodoDTO)
    {
        if (string.IsNullOrWhiteSpace(createTodoDTO.Name))
        {
            return BadRequest("To-do's name is required");
        }

        var createdTodo = await _todoService.Create(createTodoDTO);

        return CreatedAtAction(nameof(GetById), new { id = createdTodo.Id }, createdTodo.ToDTO());
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update([FromRoute] Guid id, UpdateTodoDTO updateTodoDTO)
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
