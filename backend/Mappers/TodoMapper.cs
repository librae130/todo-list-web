using backend.DTOs;
using backend.Models;

namespace backend.Mappers;

public static class TodoMapper
{
    public static TodoDTO ToDTO(this Todo todo)
    {
        return new TodoDTO
        {
            Id = todo.Id,
            Name = todo.Name,
            Description = todo.Description,
            CreatedAt = todo.CreatedAt,
        };
    }

    public static Todo ToModel(this CreateTodoDTO createTodoDTO)
    {
        return new Todo
        {
            Name = createTodoDTO.Name,
            Description = createTodoDTO.Description,
        };
    }

    public static Todo ToModel(this UpdateTodoDTO updateTodoDTO, Todo todo)
    {
        todo.Name = updateTodoDTO.Name;
        todo.Description = updateTodoDTO.Description;

        return todo;
    }
}
