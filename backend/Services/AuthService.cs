using AutoMapper;
using backend.Data;
using backend.Dtos;
using backend.Entities;

namespace backend.Services;

public class AuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AuthService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<UserDto> RegisterUserAsync(
        RegisterUserDto registerUserDto,
        CancellationToken ct
    )
    {
        var existingUser = await _unitOfWork
            .GetRepository<User>()
            .FirstOrDefaultAsync(u => u.Username == registerUserDto.Username, ct);
        if (existingUser != null)
        {
            throw new Exception("Username already exists");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = registerUserDto.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerUserDto.Password),
            CreatedAt = DateTime.UtcNow,
        };

        await _unitOfWork.GetRepository<User>().AddAsync(user);
        await _unitOfWork.SaveAsync(ct);

        return _mapper.Map<UserDto>(user);
    }

    public async Task<UserDto?> LoginUserAsync(LoginUserDto loginUserDto, CancellationToken ct)
    {
        var user = await _unitOfWork
            .GetRepository<User>()
            .FirstOrDefaultAsync(u => u.Username == loginUserDto.Username, ct);

        if (user == null || !BCrypt.Net.BCrypt.Verify(loginUserDto.Password, user.PasswordHash))
        {
            return null;
        }

        return _mapper.Map<UserDto>(user);
    }
}
