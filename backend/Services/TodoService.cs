using AutoMapper;
using backend.Data;
using backend.Dtos;
using backend.Entities;
using backend.Repositories;

namespace backend.Services;

public class TodoService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public TodoService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<List<TodoDto>> GetAllTodosAsync(Guid userId, CancellationToken ct)
    {
        List<Todo> todos = await _unitOfWork.GetRepository<Todo>().FindAsync(x => x.UserId == userId, ct);
        return todos.ConvertAll(x => _mapper.Map<TodoDto>(x));
    }

    public async Task<List<TodoDto>> SearchTodosAsync(
        Guid userId,
        SearchTodoDto searchTodoDto,
        CancellationToken ct
    )
    {
        List<Todo> searchedTodos = await (
            (ITodoRepository)_unitOfWork.GetRepository<Todo>()
        ).SearchTodosAsync(userId, searchTodoDto, ct);
        return searchedTodos.ConvertAll(x => _mapper.Map<TodoDto>(x));
    }

    public async Task<TodoDto?> GetTodoByIdAsync(Guid userId, Guid id, CancellationToken ct)
    {
        Todo? foundTodo = await _unitOfWork
            .GetRepository<Todo>()
            .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId, ct);
        return _mapper.Map<TodoDto>(foundTodo);
    }

    public async Task<TodoDto> AddTodoAsync(
        Guid userId,
        AddTodoDto addTodoDto,
        CancellationToken ct
    )
    {
        Todo todo = _mapper.Map<Todo>(addTodoDto);
        todo.CreatedAt = DateTime.UtcNow;
        todo.UserId = userId;

        await _unitOfWork.GetRepository<Todo>().AddAsync(todo, ct);
        await _unitOfWork.SaveAsync(ct);

        return _mapper.Map<TodoDto>(todo);
    }

    public async Task<TodoDto?> UpdateTodoAsync(
        Guid userId,
        Guid id,
        UpdateTodoDto updateTodoDto,
        CancellationToken ct
    )
    {
        Todo? foundTodo = await _unitOfWork
            .GetRepository<Todo>()
            .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId, ct);

        if (foundTodo == null)
        {
            return null;
        }

        foundTodo.Name = updateTodoDto.Name;
        foundTodo.Description = updateTodoDto.Description;

        _unitOfWork.GetRepository<Todo>().Update(foundTodo);
        await _unitOfWork.SaveAsync(ct);

        return _mapper.Map<TodoDto>(foundTodo);
    }

    public async Task<bool> RemoveTodoAsync(Guid userId, Guid id, CancellationToken ct)
    {
        Todo? foundTodo = await _unitOfWork
            .GetRepository<Todo>()
            .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId, ct);

        if (foundTodo == null)
        {
            return false;
        }

        _unitOfWork.GetRepository<Todo>().Remove(foundTodo);
        await _unitOfWork.SaveAsync(ct);

        return true;
    }
};
