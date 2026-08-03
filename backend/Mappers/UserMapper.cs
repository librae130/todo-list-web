using backend.Models;
using backend.DTOs;

namespace backend.Mappers;

    public static class UserMapper
    {
    public static UserDTO ToDTO(this User user)
    {
      return new UserDTO
      {
        Id = user.Id,
        Username = user.Username,
        CreatedAt = user.CreatedAt
      };
    }
}

