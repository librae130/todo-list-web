using AutoMapper;
using backend.Data;
using backend.Dtos;
using backend.Entities;
using backend.Repositories;

namespace backend.Services;

public class UserService
{
  private readonly IGenericRepository<User> _userRepo;
  private readonly IMapper _mapper;
  private readonly ILogger<UserService> _logger;

  public UserService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<UserService> logger)
  {
    _userRepo = unitOfWork.GetRepository<User>();
    _mapper = mapper;
    _logger = logger;
  }

  public async Task<UserDto?> GetUserByIdAsync(Guid userId, CancellationToken ct = default)
  {
    User? user = await _userRepo.GetByIdAsync(userId, ct);

    if (user == null)
    {
      _logger.LogWarning("User not found: {UserId}", userId);
      return null;
    }

    return _mapper.Map<UserDto>(user);
  }
}
