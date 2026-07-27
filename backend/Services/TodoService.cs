using backend.Data;
using backend.DTOs;
using backend.Mappers;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class TodoService
{
  private readonly ApplicationDBContext _context;

  public TodoService(ApplicationDBContext context)
  {
    _context = context;
  }

  public async Task<List<Todo>> GetList()
  {
    return await _context.Todos.ToListAsync();
  }

  public async Task<List<Todo>> SearchList(string? search, string? filter)
  {
    var query = _context.Todos.AsQueryable();

    // If search or filter are not provided, return the full list as a default behavior.
    if (string.IsNullOrWhiteSpace(search) || string.IsNullOrWhiteSpace(filter))
    {
      return await GetList();
    }

    var normalizedSearch = search.Trim();

    // Dynamically build the search query based on the specified filter.
    switch (filter.Trim().ToLowerInvariant())
    {
      case "name":
        query = query.Where(todo => todo.Name.ToLower().Contains(normalizedSearch.ToLower()));
        break;
      case "description":
        query = query.Where(todo => todo.Description.ToLower().Contains(normalizedSearch.ToLower()));
        break;
      case "createddate":
        // For date filtering, parse the search string and compare only the date part, ignoring the time.
        if (DateTime.TryParse(normalizedSearch, out var searchDate))
        {
          query = query.Where(todo => todo.CreatedAt.Date == searchDate.Date);
        }
        break;
      default:
        // If the filter is unknown or not provided, default to 
        // searching across both name, description and created date.
        query = query.Where(todo =>
            todo.Name.ToLower().Contains(normalizedSearch.ToLower())
            || todo.Description.ToLower().Contains(normalizedSearch.ToLower())
            || todo.CreatedAt.ToString().ToLower().Contains(normalizedSearch.ToLower())
        );
        break;
    }

    return await query.ToListAsync();
  }

  public async Task<Todo?> GetById(Guid id)
  {
    return await _context.Todos.FirstOrDefaultAsync(x => x.Id == id);
  }

  public async Task<Todo> Create(CreateTodoDTO createTodoDTO)
  {
    var todo = createTodoDTO.ToModel();
    todo.CreatedAt = DateTime.UtcNow;

    await _context.Todos.AddAsync(todo);
    await _context.SaveChangesAsync();

    return todo;
  }

  public async Task<Todo?> Update(Guid id, UpdateTodoDTO updateTodoDTO)
  {
    var foundTodo = await _context.Todos.FirstOrDefaultAsync(x => x.Id == id);

    if (foundTodo == null)
    {
      return null;
    }

    updateTodoDTO.ToModel(foundTodo);
    await _context.SaveChangesAsync();

    return foundTodo;
  }

  public async Task<bool> Delete(Guid id)
  {
    var foundTodo = await _context.Todos.FirstOrDefaultAsync(x => x.Id == id);

    if (foundTodo == null)
    {
      return false;
    }

    _context.Todos.Remove(foundTodo);
    await _context.SaveChangesAsync();

    return true;
  }
};
