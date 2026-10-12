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
    CreateMap<TodoBatchOperationDto, Todo>()
        .ForMember(destination => destination.Name, options => options.NullSubstitute(string.Empty))
        .ForMember(
            destination => destination.Description,
            options => options.NullSubstitute(string.Empty)
        );
  }
}
