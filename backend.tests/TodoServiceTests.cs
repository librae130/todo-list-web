using backend.Data;
using backend.Models;
using backend.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace backend.tests;

public class TodoServiceTests
{
    private readonly DbContextOptions<ApplicationDBContext> _options;

    public TodoServiceTests()
    {
        _options = new DbContextOptionsBuilder<ApplicationDBContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
    }

    private async Task<ApplicationDBContext> GetDbContextWithData()
    {
        var context = new ApplicationDBContext(_options);
        await context.Database.EnsureCreatedAsync();

        if (!await context.Todos.AnyAsync())
        {
            context.Todos.AddRange(
                new Todo { Id = Guid.NewGuid(), Name = "Test Todo 1", Description = "Description 1", CreatedAt = DateTime.UtcNow },
                new Todo { Id = Guid.NewGuid(), Name = "Test Todo 2", Description = "Description 2", CreatedAt = DateTime.UtcNow }
            );
            await context.SaveChangesAsync();
        }
        return context;
    }

    [Fact]
    public async Task GetById_ShouldReturnTodo_WhenTodoExists()
    {
        await using var context = await GetDbContextWithData();
        var service = new TodoService(context);
        var expectedTodo = await context.Todos.FirstAsync(); 

        var result = await service.GetById(expectedTodo.Id);

        Assert.NotNull(result);
        Assert.Equal(expectedTodo.Id, result.Id);
        Assert.Equal(expectedTodo.Name, result.Name);
    }

    [Fact]
    public async Task GetById_ShouldReturnNull_WhenTodoDoesNotExist()
    {
        await using var context = await GetDbContextWithData();
        var service = new TodoService(context);
        var nonExistentId = Guid.NewGuid();

        var result = await service.GetById(nonExistentId);

        Assert.Null(result);
    }
}
