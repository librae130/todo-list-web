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

  public async Task<List<TodoDTO>> GetTodoListAsync(Guid userId, CancellationToken cancellationToken)
  {
    var query = _context.Todos.AsQueryable();
    query = query.Where(x => x.UserId == userId);
    var todos = await query.ToListAsync(cancellationToken);
    return todos.ConvertAll(x => x.ToDTO());
  }

  public async Task<List<TodoDTO>> SearchTodoListAsync(
      Guid userId,
      string? search,
      string? filter,
      CancellationToken cancellationToken
  )
  {
    var query = _context.Todos.AsQueryable();

    // If search or filter are not provided, return the full list as a default behavior.
    if (string.IsNullOrWhiteSpace(search) || string.IsNullOrWhiteSpace(filter))
    {
      return await GetTodoListAsync(userId, cancellationToken);
    }

    var normalizedSearch = search.Trim();

    // Dynamically build the search query based on the specified filter.
    switch (filter.Trim().ToLowerInvariant())
    {
      case "name":
        query = query.Where(x =>
            x.Name.ToLower().Contains(normalizedSearch.ToLower()) && x.UserId == userId
        );
        break;
      case "description":
        query = query.Where(x =>
            x.Description.ToLower().Contains(normalizedSearch.ToLower())
            && x.UserId == userId
        );
        break;
      case "createddate":
        // For date filtering, parse the search string and compare only the date part, ignoring the time.
        if (DateTime.TryParse(normalizedSearch, out var searchDate))
        {
          query = query.Where(x =>
              x.CreatedAt.Date == searchDate.Date && x.UserId == userId
          );
        }
        break;
      default:
        // If the filter is unknown or not provided, default to
        // searching across both name, description and created date.
        query = query.Where(x =>
            (
                x.Name.ToLower().Contains(normalizedSearch.ToLower())
                || x.Description.ToLower().Contains(normalizedSearch.ToLower())
                || x.CreatedAt.ToString().ToLower().Contains(normalizedSearch.ToLower())
            )
            && x.UserId == userId
        );
        break;
    }

    var todos = await query.ToListAsync(cancellationToken);
    return todos.ConvertAll(x => x.ToDTO());
  }

  public async Task<TodoDTO?> GetTodoByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken)
  {
    var foundTodo = await _context.Todos.FirstOrDefaultAsync(
        x => x.Id == id && x.UserId == userId,
        cancellationToken
    );

    return foundTodo?.ToDTO();
  }

  public async Task<TodoDTO> CreateTodoAsync(
      CreateTodoDTO createTodoDTO,
      Guid userId,
      CancellationToken cancellationToken
  )
  {
    var todo = createTodoDTO.ToModel();
    todo.CreatedAt = DateTime.UtcNow;
    todo.UserId = userId;

    await _context.Todos.AddAsync(todo, cancellationToken);
    await _context.SaveChangesAsync(cancellationToken);

    return todo.ToDTO();
  }

  public async Task<TodoDTO?> UpdateTodoAsync(
      Guid id,
      UpdateTodoDTO updateTodoDTO,
      Guid userId,
      CancellationToken cancellationToken
  )
  {
    var foundTodo = await _context.Todos.FirstOrDefaultAsync(
        x => x.Id == id && x.UserId == userId,
        cancellationToken
    );

    if (foundTodo == null)
    {
      return null;
    }

    updateTodoDTO.ToModel(foundTodo);
    await _context.SaveChangesAsync(cancellationToken);

    return foundTodo.ToDTO();
  }

  public async Task<bool> DeleteTodoAsync(Guid id, Guid userId, CancellationToken cancellationToken)
  {
    var foundTodo = await _context.Todos.FirstOrDefaultAsync(
        x => x.Id == id && x.UserId == userId,
        cancellationToken
    );

    if (foundTodo == null)
    {
      return false;
    }

    _context.Todos.Remove(foundTodo);
    await _context.SaveChangesAsync(cancellationToken);

    return true;
  }
};
