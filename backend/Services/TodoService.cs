using backend.Data;
using backend.Dtos;
using backend.Mappers;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

internal class TodoService
{
  private readonly ApplicationDBContext _context;

  public TodoService(ApplicationDBContext context)
  {
    _context = context;
  }

  public async Task<List<TodoDto>> GetTodoListAsync(Guid userId, CancellationToken cancellationToken)
  {
    var query = _context.Todos.AsQueryable();
    query = query.Where(x => x.UserId == userId);
    var todos = await query.ToListAsync(cancellationToken);
    return todos.ConvertAll(x => x.ToDto());
  }

  public async Task<List<TodoDto>> SearchTodoListAsync(
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
    return todos.ConvertAll(x => x.ToDto());
  }

  public async Task<TodoDto?> GetTodoByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken)
  {
    var foundTodo = await _context.Todos.FirstOrDefaultAsync(
        x => x.Id == id && x.UserId == userId,
        cancellationToken
    );

    return foundTodo?.ToDto();
  }

  public async Task<TodoDto> CreateTodoAsync(
      CreateTodoDto createTodoDto,
      Guid userId,
      CancellationToken cancellationToken
  )
  {
    var todo = createTodoDto.ToModel();
    todo.CreatedAt = DateTime.UtcNow;
    todo.UserId = userId;

    await _context.Todos.AddAsync(todo, cancellationToken);
    await _context.SaveChangesAsync(cancellationToken);

    return todo.ToDto();
  }

  public async Task<TodoDto?> UpdateTodoAsync(
      Guid id,
      UpdateTodoDto updateTodoDto,
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

    updateTodoDto.ToModel(foundTodo);
    await _context.SaveChangesAsync(cancellationToken);

    return foundTodo.ToDto();
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
