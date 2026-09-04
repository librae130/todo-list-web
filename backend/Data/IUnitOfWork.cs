using backend.Repositories;

namespace backend.Data;

public interface IUnitOfWork : IDisposable
{
    IGenericRepository<T> GetRepository<T>()
        where T : class;
    Task<int> SaveAsync(CancellationToken ct = default);
}
