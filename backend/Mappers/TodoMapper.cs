using backend.Dtos;
using backend.Models;

namespace backend.Mappers;

internal static class TodoMapper
{
    public static TodoDto ToDto(this Todo todo)
    {
        return new TodoDto
        {
            Id = todo.Id,
            Name = todo.Name,
            Description = todo.Description,
            CreatedAt = todo.CreatedAt,
        };
    }

    public static Todo ToModel(this CreateTodoDto createTodoDto)
    {
        return new Todo
        {
            Name = createTodoDto.Name,
            Description = createTodoDto.Description,
        };
    }

    public static Todo ToModel(this UpdateTodoDto updateTodoDto, Todo todo)
    {
        todo.Name = updateTodoDto.Name;
        todo.Description = updateTodoDto.Description;

        return todo;
    }
}
