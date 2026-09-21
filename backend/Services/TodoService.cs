using System.Linq.Expressions;
using AutoMapper;
using backend.Data;
using backend.Dtos;
using backend.Entities;
using backend.Helpers;
using backend.Repositories;

namespace backend.Services;

public class TodoService
{
  private readonly IGenericRepository<Todo> _todoRepo;
  private readonly IMapper _mapper;
  private readonly ILogger<TodoService> _logger;

  public TodoService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<TodoService> logger)
  {
    _todoRepo = unitOfWork.GetRepository<Todo>();
    _mapper = mapper;
    _logger = logger;
  }

  public async Task<List<TodoDto>> GetAllTodosAsync(Guid userId, CancellationToken ct = default)
  {
    List<Todo> todos = await _todoRepo.FindAsync(x => x.UserId == userId, ct);
    return todos.ConvertAll(x => _mapper.Map<TodoDto>(x));
  }

  public async Task<List<TodoDto>> SearchTodosAsync(
      Guid userId,
      SearchTodoDto searchTodoDto,
      CancellationToken cancellationToken = default
  )
  {
    Expression<Func<Todo, bool>> filter = x => x.UserId == userId;

    if (!string.IsNullOrWhiteSpace(searchTodoDto.Name))
    {
      string name = searchTodoDto.Name.Trim().ToLower();
      filter = filter.AndAlso(x => x.Name.ToLower().Contains(name));
    }

    if (!string.IsNullOrWhiteSpace(searchTodoDto.Description))
    {
      string description = searchTodoDto.Description.Trim().ToLower();
      filter = filter.AndAlso(x => x.Description.ToLower().Contains(description));
    }

    if (DateTime.TryParse(searchTodoDto.CreatedAt, out DateTime parsedDate))
    {
      DateTime startDate = parsedDate.Date;
      DateTime endDate = startDate.AddDays(1);
      filter = filter.AndAlso(x => x.CreatedAt >= startDate && x.CreatedAt < endDate);
    }

    List<Todo> searchedTodos = await _todoRepo.FindAsync(filter, cancellationToken);
    return searchedTodos.ConvertAll(x => _mapper.Map<TodoDto>(x));
  }

  public async Task<TodoDto?> GetTodoByIdAsync(Guid id, CancellationToken ct = default)
  {
    Todo? foundTodo = await _todoRepo.GetByIdAsync(id, ct);
    return _mapper.Map<TodoDto>(foundTodo);
  }

  public async Task<TodoDto> AddTodoAsync(
      Guid userId,
      AddTodoDto addTodoDto,
      CancellationToken ct = default
  )
  {
    Todo todo = _mapper.Map<Todo>(addTodoDto);
    todo.CreatedAt = DateTime.UtcNow;
    todo.UserId = userId;

    await _todoRepo.AddAsync(todo, ct);
    await _todoRepo.SaveAsync(ct);

    _logger.LogInformation("Todo created: {TodoId} for user {UserId}", todo.Id, userId);

    return _mapper.Map<TodoDto>(todo);
  }

  public async Task<TodoDto?> UpdateTodoAsync(
      Guid id,
      UpdateTodoDto updateTodoDto,
      CancellationToken ct = default
  )
  {
    Todo? foundTodo = await _todoRepo.GetByIdAsync(id, ct);

    if (foundTodo == null)
    {
      return null;
    }

    _mapper.Map(updateTodoDto, foundTodo);

    _todoRepo.Update(foundTodo);
    await _todoRepo.SaveAsync(ct);

    _logger.LogInformation("Todo updated: {TodoId}", id);

    return _mapper.Map<TodoDto>(foundTodo);
  }

  public async Task<bool> RemoveTodoAsync(Guid id, CancellationToken ct = default)
  {
    Todo? foundTodo = await _todoRepo.GetByIdAsync(id, ct);

    if (foundTodo == null)
    {
      return false;
    }

    _todoRepo.Remove(foundTodo);
    await _todoRepo.SaveAsync(ct);

    _logger.LogInformation("Todo deleted: {TodoId}", id);

    return true;
  }
};
