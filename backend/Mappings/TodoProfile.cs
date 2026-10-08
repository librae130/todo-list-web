using AutoMapper;
using backend.Dtos;
using backend.Entities;

namespace backend.Mappings;

public class TodoProfile : Profile
{
    public TodoProfile()
    {
        CreateMap<Todo, TodoDto>();
        CreateMap<AddTodoDto, Todo>();
        CreateMap<UpdateTodoDto, Todo>();
    }
}
