using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

internal class ApplicationDBContext : DbContext
{
    public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options)
        : base(options) { }

    public DbSet<Todo> Todos { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;
}
