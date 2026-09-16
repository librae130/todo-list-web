using AutoMapper;
using backend.Data;
using backend.Dtos;
using backend.Entities;

namespace backend.Services;

public class UserService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UserService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<UserDto?> GetUserByIdAsync(Guid userId, CancellationToken ct)
    {
        User? user = await _unitOfWork.GetRepository<User>().GetByIdAsync(userId);

        if (user == null)
        {
            return null;
        }

        return _mapper.Map<UserDto>(user);
    }
}
