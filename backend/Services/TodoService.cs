using AutoMapper;
using backend.Data;
using backend.Dtos;
using backend.Entities;
using backend.Repositories;

namespace backend.Services;

public class TodoService
{
    private readonly IGenericRepository<Todo> _todoRepo;
    private readonly IMapper _mapper;

    public TodoService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _todoRepo = unitOfWork.GetRepository<Todo>();
        _mapper = mapper;
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
    bool hasName = !string.IsNullOrWhiteSpace(searchTodoDto.Name);
    string nameSearch = hasName ? searchTodoDto.Name.Trim().ToLower() : "";

    bool hasDescription = !string.IsNullOrWhiteSpace(searchTodoDto.Description);
    string descriptionSearch = hasDescription ? searchTodoDto.Description.Trim().ToLower() : "";

    bool hasDate = DateTime.TryParse(searchTodoDto.CreatedAt, out DateTime parsedDate);
    DateTime startDate = hasDate ? parsedDate.Date : default;
    DateTime endDate = hasDate ? parsedDate.Date.AddDays(1) : default;

    List<Todo> searchedTodos = new();

    if (hasName || hasDescription || hasDate)
    {
      searchedTodos = await _todoRepo.FindAsync(x => (x.UserId == userId) && (
          (hasName && x.Name.ToLower().Contains(nameSearch))
          || (hasDescription && x.Description.ToLower().Contains(descriptionSearch))
          || (hasDate && x.CreatedAt >= startDate && x.CreatedAt < endDate)
      ));
    }
    else
    {
            searchedTodos = await _todoRepo.FindAsync(x => x.UserId == userId);
    }

        return searchedTodos.ConvertAll(x => _mapper.Map<TodoDto>(x));
    }

    public async Task<TodoDto?> GetTodoByIdAsync(Guid userId, Guid id, CancellationToken ct = default)
    {
        Todo? foundTodo = await _todoRepo.FirstOrDefaultAsync(
            x => x.Id == id && x.UserId == userId,
            ct
        );
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

        return _mapper.Map<TodoDto>(todo);
    }

    public async Task<TodoDto?> UpdateTodoAsync(
        Guid userId,
        Guid id,
        UpdateTodoDto updateTodoDto,
        CancellationToken ct = default
    )
    {
        Todo? foundTodo = await _todoRepo.FirstOrDefaultAsync(
            x => x.Id == id && x.UserId == userId,
            ct
        );

        if (foundTodo == null)
        {
            return null;
        }

        foundTodo.Name = updateTodoDto.Name;
        foundTodo.Description = updateTodoDto.Description;

        _todoRepo.Update(foundTodo);
        await _todoRepo.SaveAsync(ct);

        return _mapper.Map<TodoDto>(foundTodo);
    }

    public async Task<bool> RemoveTodoAsync(Guid userId, Guid id, CancellationToken ct = default)
    {
        Todo? foundTodo = await _todoRepo.FirstOrDefaultAsync(
            x => x.Id == id && x.UserId == userId,
            ct
        );

        if (foundTodo == null)
        {
            return false;
        }

        _todoRepo.Remove(foundTodo);
        await _todoRepo.SaveAsync(ct);

        return true;
    }
};
