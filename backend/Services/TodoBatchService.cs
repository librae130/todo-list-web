using System.ComponentModel.DataAnnotations;
using AutoMapper;
using backend.Data;
using backend.Dtos;
using backend.Entities;
using backend.Repositories;

namespace backend.Services;

public class TodoBatchService
{
    private readonly IGenericRepository<Todo> _todoRepo;
    private readonly IMapper _mapper;

    public TodoBatchService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _todoRepo = unitOfWork.GetRepository<Todo>();
        _mapper = mapper;
    }

    private static string? ValidateBatchOperation(TodoBatchOperationDto operation)
    {
        switch (operation.Action)
        {
            case "add":
                if (HasTodoId(operation.TodoId))
                {
                    return "A new to-do cannot include an ID.";
                }

                return ValidateTodoDetails(
                    operation.Name ?? string.Empty,
                    new AddTodoDto
                    {
                        Name = operation.Name ?? string.Empty,
                        Description = operation.Description ?? string.Empty,
                    }
                );

            case "update":
                if (!HasTodoId(operation.TodoId))
                {
                    return "A to-do ID is required.";
                }

                return ValidateTodoDetails(
                    operation.Name ?? string.Empty,
                    new UpdateTodoDto
                    {
                        Name = operation.Name ?? string.Empty,
                        Description = operation.Description ?? string.Empty,
                    }
                );

            case "remove":
                if (!HasTodoId(operation.TodoId))
                {
                    return "A to-do ID is required.";
                }

                return null;

            default:
                return "Action must be add, update, or remove.";
        }
    }

    private static bool HasTodoId(Guid? todoId)
    {
        return todoId.HasValue && todoId != Guid.Empty;
    }

    private static string? ValidateTodoDetails(string name, object todoDto)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            return "A to-do name is required.";
        }

        List<ValidationResult> validationResults = [];
        bool isValid = Validator.TryValidateObject(
            todoDto,
            new ValidationContext(todoDto),
            validationResults,
            validateAllProperties: true
        );

        if (!isValid)
        {
            return validationResults[0].ErrorMessage;
        }

        return null;
    }

    public async Task<List<TodoBatchOperationResultDto>> ApplyTodoBatchAsync(
        Guid userId,
        TodoBatchRequestDto request,
        CancellationToken ct = default
    )
    {
        List<TodoBatchOperationDto> operations = request.Operations;
        List<TodoBatchOperationResultDto> results = [];
        bool hasChanges = false;

        foreach (TodoBatchOperationDto operation in operations)
        {
            TodoBatchOperationResultDto result = new()
            {
                ClientId = operation.ClientId,
                Action = operation.Action,
                ErrorMessage = string.Empty,
            };

            result.ErrorMessage = ValidateBatchOperation(operation) ?? string.Empty;

            if (result.ErrorMessage.Length == 0)
            {
                switch (operation.Action)
                {
                    case "add":
                        hasChanges =
                            await AddTodoFromBatchAsync(userId, operation, result, ct)
                            || hasChanges;
                        break;
                    case "update":
                        hasChanges =
                            await UpdateTodoFromBatchAsync(userId, operation, result, ct)
                            || hasChanges;
                        break;
                    case "remove":
                        hasChanges =
                            await RemoveTodoFromBatchAsync(userId, operation, result, ct)
                            || hasChanges;
                        break;
                }
            }

            result.IsSucceeded = string.IsNullOrEmpty(result.ErrorMessage);
            results.Add(result);
        }

        if (hasChanges)
        {
            await _todoRepo.SaveAsync(ct);
        }

        return results;
    }

    private async Task<bool> AddTodoFromBatchAsync(
        Guid userId,
        TodoBatchOperationDto operation,
        TodoBatchOperationResultDto result,
        CancellationToken ct
    )
    {
        Todo todo = _mapper.Map<Todo>(
            new AddTodoDto
            {
                Name = operation.Name ?? string.Empty,
                Description = operation.Description ?? string.Empty,
            }
        );
        todo.UserId = userId;
        todo.CreatedAt = DateTime.UtcNow;

        await _todoRepo.AddAsync(todo, ct);
        result.Todo = _mapper.Map<TodoDto>(todo);
        return true;
    }

    private async Task<bool> UpdateTodoFromBatchAsync(
        Guid userId,
        TodoBatchOperationDto operation,
        TodoBatchOperationResultDto result,
        CancellationToken ct
    )
    {
        Todo? todo = await _todoRepo.GetByIdAsync(operation.TodoId!.Value, ct);
        if (todo == null || todo.UserId != userId)
        {
            result.ErrorMessage = "To-do was not found.";
            return false;
        }

        _mapper.Map(
            new UpdateTodoDto
            {
                Name = operation.Name ?? string.Empty,
                Description = operation.Description ?? string.Empty,
            },
            todo
        );
        _todoRepo.Update(todo);
        result.Todo = _mapper.Map<TodoDto>(todo);
        return true;
    }

    private async Task<bool> RemoveTodoFromBatchAsync(
        Guid userId,
        TodoBatchOperationDto operation,
        TodoBatchOperationResultDto result,
        CancellationToken ct
    )
    {
        Todo? todo = await _todoRepo.GetByIdAsync(operation.TodoId!.Value, ct);
        if (todo == null || todo.UserId != userId)
        {
            result.ErrorMessage = "To-do was not found.";
            return false;
        }

        _todoRepo.Remove(todo);
        result.TodoId = todo.Id;
        return true;
    }
}
