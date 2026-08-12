using backend.Data;
using backend.Dtos;
using backend.Entities;
using backend.Mappers;
using backend.Repositories;

namespace backend.Services;

public class TodoService
{
    private readonly IUnitOfWork _unitOfWork;

    public TodoService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<List<TodoDto>> GetAllTodosAsync(Guid userId, CancellationToken ct)
    {
        var todos = await _unitOfWork.GetRepository<Todo>().FindAsync(x => x.UserId == userId, ct);
        return todos.ConvertAll(x => x.ToDto());
    }

    public async Task<List<TodoDto>> SearchTodosAsync(
        Guid userId,
        SearchTodoDto searchTodoDto,
        CancellationToken ct
    )
    {
        var searchedTodos = await (
            (ITodoRepository)_unitOfWork.GetRepository<Todo>()
        ).SearchTodosAsync(userId, searchTodoDto, ct);
        return searchedTodos.ConvertAll(x => x.ToDto());
    }

    public async Task<TodoDto?> GetTodoByIdAsync(Guid userId, Guid id, CancellationToken ct)
    {
        var foundTodo = await _unitOfWork
            .GetRepository<Todo>()
            .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId, ct);
        return foundTodo?.ToDto();
    }

    public async Task<TodoDto> AddTodoAsync(
        Guid userId,
        AddTodoDto addTodoDto,
        CancellationToken ct
    )
    {
        var todo = addTodoDto.ToModel();
        todo.CreatedAt = DateTime.UtcNow;
        todo.UserId = userId;

        await _unitOfWork.GetRepository<Todo>().AddAsync(todo, ct);
        await _unitOfWork.SaveAsync(ct);

        return todo.ToDto();
    }

    public async Task<TodoDto?> UpdateTodoAsync(
        Guid userId,
        Guid id,
        UpdateTodoDto updateTodoDto,
        CancellationToken ct
    )
    {
        var foundTodo = await _unitOfWork
            .GetRepository<Todo>()
            .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId, ct);

        if (foundTodo == null)
        {
            return null;
        }

        updateTodoDto.ToModel(foundTodo);
        _unitOfWork.GetRepository<Todo>().Update(foundTodo);
        await _unitOfWork.SaveAsync(ct);

        return foundTodo.ToDto();
    }

    public async Task<bool> RemoveTodoAsync(Guid userId, Guid id, CancellationToken ct)
    {
        var foundTodo = await _unitOfWork
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
