using backend.Dtos;
using backend.Entities;

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

    public static Todo ToModel(this AddTodoDto addTodoDto)
    {
        return new Todo { Name = addTodoDto.Name, Description = addTodoDto.Description };
    }

    public static Todo ToModel(this UpdateTodoDto updateTodoDto, Todo todo)
    {
        todo.Name = updateTodoDto.Name;
        todo.Description = updateTodoDto.Description;

        return todo;
    }
}
