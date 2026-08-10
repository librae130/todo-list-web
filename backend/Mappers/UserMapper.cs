using backend.Dtos;
using backend.Entities;

namespace backend.Mappers;

internal static class UserMapper
{
    public static UserDto ToDto(this User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            CreatedAt = user.CreatedAt,
        };
    }
}
