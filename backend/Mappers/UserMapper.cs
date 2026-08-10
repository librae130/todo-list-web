using backend.Models;
using backend.Dtos;

namespace backend.Mappers;

    internal static class UserMapper
    {
    public static UserDto ToDto(this User user)
    {
      return new UserDto
      {
        Id = user.Id,
        Username = user.Username,
        CreatedAt = user.CreatedAt
      };
    }
}

