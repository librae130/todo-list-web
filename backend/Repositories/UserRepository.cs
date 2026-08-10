using backend.Entities;
using backend.Data;

namespace backend.Repositories;

public class UserRepository : GenericRepository<User>, IUserRepository
{
  public UserRepository(ApplicationDBContext context)
      : base(context) { }
        
}
