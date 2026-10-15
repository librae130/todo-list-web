using AutoMapper;
using backend.Dtos;
using backend.Entities;

namespace backend.Mappings;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<User, UserDto>();
    }
}
