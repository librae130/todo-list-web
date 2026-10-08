using AutoMapper;
using backend.Data;
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
  public async Task GetTodoByIdAsync_ReturnsTodo_ForMatchingUser()
  {
    // Arrange
    var options = new DbContextOptionsBuilder<ApplicationDBContext>()
        .UseInMemoryDatabase(Guid.NewGuid().ToString())
        .Options;

    await using var context = new ApplicationDBContext(options);

    var ownerUserId = Guid.NewGuid();
    var otherUserId = Guid.NewGuid();

    var todoId = Guid.NewGuid();

    context.Todos.Add(
        new Todo
        {
          Id = todoId,
          UserId = ownerUserId,
          Name = "My todo",
          Description = "Owned by me",
          CreatedAt = DateTime.UtcNow,
        }
    );

    context.Todos.Add(
        new Todo
        {
          Id = Guid.NewGuid(),
          UserId = otherUserId,
          Name = "Other user todo",
          Description = "Should not be returned",
          CreatedAt = DateTime.UtcNow,
        }
    );

    await context.SaveChangesAsync();

    var service = CreateService(context);

    // Act
    var result = await service.GetTodoByIdAsync(todoId);

    // Assert
    Assert.NotNull(result);
    Assert.Equal("My todo", result!.Name);
  }

  [Fact]
  public async Task GetTodoByIdAsync_ReturnsNull_WhenTodoBelongsToAnotherUser()
  {
    // Arrange
    var options = new DbContextOptionsBuilder<ApplicationDBContext>()
        .UseInMemoryDatabase(Guid.NewGuid().ToString())
        .Options;

    await using var context = new ApplicationDBContext(options);

    var ownerUserId = Guid.NewGuid();
    var otherUserId = Guid.NewGuid();

    var todoId = Guid.NewGuid();

    context.Todos.Add(
        new Todo
        {
          Id = todoId,
          UserId = otherUserId,
          Name = "Other user todo",
          Description = "Not mine",
          CreatedAt = DateTime.UtcNow,
        }
    );

    await context.SaveChangesAsync();

    var service = CreateService(context);

    // Act
    var result = await service.GetTodoByIdAsync(todoId);

    // Assert
    Assert.Null(result);
  }
}
