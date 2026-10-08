using AutoMapper;
using backend.Data;
using backend.Dtos;
using backend.Entities;
using backend.Mappings;
using backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace backend.tests;

public class TodoServiceTests
{
  private static TodoService CreateService(ApplicationDBContext context)
  {
    var unitOfWork = new UnitOfWork<ApplicationDBContext>(context);

    var mapperConfig = new MapperConfiguration(config =>
    {
      config.AddProfile<TodoProfile>();
    });

    var mapper = mapperConfig.CreateMapper();

    return new TodoService(unitOfWork, mapper, NullLogger<TodoService>.Instance);
  }

  [Fact]
  public async Task GetAllTodosAsync_ReturnsOnlyTodosForRequestedUser()
  {
    var options = new DbContextOptionsBuilder<ApplicationDBContext>()
        .UseInMemoryDatabase(Guid.NewGuid().ToString())
        .Options;

    await using var context = new ApplicationDBContext(options);

    var userId = Guid.NewGuid();
    var otherUserId = Guid.NewGuid();

    context.Todos.AddRange(
        new Todo { Id = Guid.NewGuid(), UserId = userId, Name = "First", Description = "Mine", CreatedAt = new DateTime(2026, 10, 8, 9, 0, 0, DateTimeKind.Utc) },
        new Todo { Id = Guid.NewGuid(), UserId = userId, Name = "Second", Description = "Also mine", CreatedAt = new DateTime(2026, 10, 9, 10, 30, 0, DateTimeKind.Utc) },
        new Todo { Id = Guid.NewGuid(), UserId = otherUserId, Name = "Other", Description = "Not mine", CreatedAt = new DateTime(2026, 10, 8, 12, 0, 0, DateTimeKind.Utc) }
    );

    await context.SaveChangesAsync();

    var service = CreateService(context);

    var result = await service.GetAllTodosAsync(userId);

    Assert.Equal(2, result.Count);
    Assert.Collection(
        result,
        todo => Assert.Equal("First", todo.Name),
        todo => Assert.Equal("Second", todo.Name)
    );
  }

  [Fact]
  public async Task SearchTodosAsync_FiltersByUserAndMatchingCriteria()
  {
    var options = new DbContextOptionsBuilder<ApplicationDBContext>()
        .UseInMemoryDatabase(Guid.NewGuid().ToString())
        .Options;

    await using var context = new ApplicationDBContext(options);

    var userId = Guid.NewGuid();
    var otherUserId = Guid.NewGuid();

    context.Todos.AddRange(
        new Todo { Id = Guid.NewGuid(), UserId = userId, Name = "Alpha task", Description = "Fix auth bug", CreatedAt = new DateTime(2026, 10, 8, 9, 15, 0, DateTimeKind.Utc) },
        new Todo { Id = Guid.NewGuid(), UserId = userId, Name = "Beta task", Description = "Write docs", CreatedAt = new DateTime(2026, 10, 9, 15, 0, 0, DateTimeKind.Utc) },
        new Todo { Id = Guid.NewGuid(), UserId = otherUserId, Name = "Alpha task", Description = "Fix auth bug", CreatedAt = new DateTime(2026, 10, 8, 9, 30, 0, DateTimeKind.Utc) }
    );

    await context.SaveChangesAsync();

    var service = CreateService(context);

    var result = await service.SearchTodosAsync(
        userId,
        new SearchTodoDto { Name = "alpha", Description = "fix", CreatedAt = "2026-10-08" }
    );

    var todo = Assert.Single(result);
    Assert.Equal("Alpha task", todo.Name);
    Assert.Equal("Fix auth bug", todo.Description);
  }

  [Fact]
  public async Task GetTodoByIdAsync_ReturnsTodo_WhenTodoExists()
  {
    var options = new DbContextOptionsBuilder<ApplicationDBContext>()
        .UseInMemoryDatabase(Guid.NewGuid().ToString())
        .Options;

    await using var context = new ApplicationDBContext(options);

    var todoId = Guid.NewGuid();
    var userId = Guid.NewGuid();

    context.Todos.Add(
        new Todo
        {
          Id = todoId,
          UserId = userId,
          Name = "My todo",
          Description = "Owned by me",
          CreatedAt = new DateTime(2026, 10, 8, 8, 0, 0, DateTimeKind.Utc),
        }
    );

    await context.SaveChangesAsync();

    var service = CreateService(context);

    var result = await service.GetTodoByIdAsync(todoId);

    Assert.NotNull(result);
    Assert.Equal(todoId, result!.Id);
    Assert.Equal("My todo", result.Name);
    Assert.Equal("Owned by me", result.Description);
  }

  [Fact]
  public async Task GetTodoByIdAsync_ReturnsNull_WhenTodoDoesNotExist()
  {
    var options = new DbContextOptionsBuilder<ApplicationDBContext>()
        .UseInMemoryDatabase(Guid.NewGuid().ToString())
        .Options;

    await using var context = new ApplicationDBContext(options);

    var service = CreateService(context);

    var result = await service.GetTodoByIdAsync(Guid.NewGuid());

    Assert.Null(result);
  }

  [Fact]
  public async Task AddTodoAsync_CreatesTodoForUser()
  {
    var options = new DbContextOptionsBuilder<ApplicationDBContext>()
        .UseInMemoryDatabase(Guid.NewGuid().ToString())
        .Options;

    await using var context = new ApplicationDBContext(options);

    var userId = Guid.NewGuid();
    var service = CreateService(context);
    var before = DateTime.UtcNow;

    var result = await service.AddTodoAsync(
        userId,
        new AddTodoDto { Name = "New todo", Description = "A new task" }
    );

    var after = DateTime.UtcNow;
    var persistedTodo = await context.Todos.SingleAsync();

    Assert.Equal("New todo", result.Name);
    Assert.Equal("A new task", result.Description);
    Assert.InRange(result.CreatedAt, before, after);
    Assert.Equal(userId, persistedTodo.UserId);
    Assert.Equal("New todo", persistedTodo.Name);
    Assert.Equal("A new task", persistedTodo.Description);
    Assert.InRange(persistedTodo.CreatedAt, before, after);
  }

  [Fact]
  public async Task UpdateTodoAsync_UpdatesExistingTodo()
  {
    var options = new DbContextOptionsBuilder<ApplicationDBContext>()
        .UseInMemoryDatabase(Guid.NewGuid().ToString())
        .Options;

    await using var context = new ApplicationDBContext(options);

    var todoId = Guid.NewGuid();
    var userId = Guid.NewGuid();

    context.Todos.Add(
        new Todo
        {
          Id = todoId,
          UserId = userId,
          Name = "Old title",
          Description = "Old description",
          CreatedAt = new DateTime(2026, 9, 1, 12, 0, 0, DateTimeKind.Utc),
        }
    );

    await context.SaveChangesAsync();

    var service = CreateService(context);

    var result = await service.UpdateTodoAsync(
        todoId,
        new UpdateTodoDto { Name = "Updated title", Description = "Updated description" }
    );

    Assert.NotNull(result);
    Assert.Equal(todoId, result!.Id);
    Assert.Equal("Updated title", result.Name);
    Assert.Equal("Updated description", result.Description);

    var savedTodo = await context.Todos.SingleAsync(x => x.Id == todoId);
    Assert.Equal("Updated title", savedTodo.Name);
    Assert.Equal("Updated description", savedTodo.Description);
  }

  [Fact]
  public async Task UpdateTodoAsync_ReturnsNull_WhenTodoDoesNotExist()
  {
    var options = new DbContextOptionsBuilder<ApplicationDBContext>()
        .UseInMemoryDatabase(Guid.NewGuid().ToString())
        .Options;

    await using var context = new ApplicationDBContext(options);

    var service = CreateService(context);

    var result = await service.UpdateTodoAsync(
        Guid.NewGuid(),
        new UpdateTodoDto { Name = "Does not exist", Description = "Nope" }
    );

    Assert.Null(result);
  }

  [Fact]
  public async Task RemoveTodoAsync_RemovesTodo_WhenItExists()
  {
    var options = new DbContextOptionsBuilder<ApplicationDBContext>()
        .UseInMemoryDatabase(Guid.NewGuid().ToString())
        .Options;

    await using var context = new ApplicationDBContext(options);

    var todoId = Guid.NewGuid();
    var userId = Guid.NewGuid();

    context.Todos.Add(
        new Todo
        {
          Id = todoId,
          UserId = userId,
          Name = "Delete me",
          Description = "Will be removed",
          CreatedAt = new DateTime(2026, 10, 10, 11, 0, 0, DateTimeKind.Utc),
        }
    );

    await context.SaveChangesAsync();

    var service = CreateService(context);

    var result = await service.RemoveTodoAsync(todoId);

    Assert.True(result);
    Assert.Null(await context.Todos.FindAsync(todoId));
  }

  [Fact]
  public async Task RemoveTodoAsync_ReturnsFalse_WhenTodoDoesNotExist()
  {
    var options = new DbContextOptionsBuilder<ApplicationDBContext>()
        .UseInMemoryDatabase(Guid.NewGuid().ToString())
        .Options;

    await using var context = new ApplicationDBContext(options);

    var service = CreateService(context);

    var result = await service.RemoveTodoAsync(Guid.NewGuid());

    Assert.False(result);
  }
}
