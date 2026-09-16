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

    public UserService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _userRepo = unitOfWork.GetRepository<User>();
        _mapper = mapper;
    }

    public async Task<UserDto?> GetUserByIdAsync(Guid userId, CancellationToken ct)
    {
        User? user = await _userRepo.GetByIdAsync(userId, ct);

        if (user == null)
        {
            return null;
        }

        return _mapper.Map<UserDto>(user);
    }
}
