using backend.Data;
using backend.DTOs;
using backend.Mappers;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class TodoService
{
    private readonly ApplicationDBContext _context;

    public TodoService(ApplicationDBContext context)
    {
        _context = context;
    }

    public async Task<List<Todo>> GetList()
    {
        return await _context.Todos.ToListAsync();
    }

    public async Task<List<Todo>> SearchList(string? search, string? filter)
    {
        var query = _context.Todos.AsQueryable();

        if (!string.IsNullOrEmpty(search) && !string.IsNullOrEmpty(filter))
        {
            var normalizedSearch = search.Trim();

            switch (filter.Trim())
            {
                case "name":
                    var nameSearch = normalizedSearch.ToLowerInvariant();
                    query = query.Where(todo => todo.Name.ToLower().Contains(nameSearch));
                    break;
                case "description":
                    var descSearch = normalizedSearch.ToLowerInvariant();
                    query = query.Where(todo => todo.Description.ToLower().Contains(descSearch));
                    break;
                case "createdDate":
                    var dateSearch = normalizedSearch.ToLowerInvariant();
                    query = query.Where(todo =>
                        todo.CreatedAt.ToString().ToLower().Contains(dateSearch)
                    );
                    break;
                default:
                    var anySearch = normalizedSearch.ToLowerInvariant();
                    query = query.Where(todo =>
                        todo.Name.ToLower().Contains(anySearch)
                        || todo.Description.ToLower().Contains(anySearch)
                        || todo.CreatedAt.ToString().ToLower().Contains(anySearch)
                    );
                    break;
            }
        }

        return await query.ToListAsync();
    }

    public async Task<Todo?> GetById(Guid id)
    {
        return await _context.Todos.FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Todo> Create(CreateTodoDTO createTodoDTO)
    {
        var todo = createTodoDTO.ToModel();
        todo.CreatedAt = DateTime.UtcNow;

        await _context.Todos.AddAsync(todo);
        await _context.SaveChangesAsync();

        return todo;
    }

    public async Task<Todo?> Update(Guid id, UpdateTodoDTO updateTodoDTO)
    {
        var foundTodo = await _context.Todos.FirstOrDefaultAsync(x => x.Id == id);

        if (foundTodo == null)
        {
            return null;
        }

        updateTodoDTO.ToModel(foundTodo);
        await _context.SaveChangesAsync();

        return foundTodo;
    }

    public async Task<bool> Delete(Guid id)
    {
        var foundTodo = await _context.Todos.FirstOrDefaultAsync(x => x.Id == id);

        if (foundTodo == null)
        {
            return false;
        }

        _context.Todos.Remove(foundTodo);
        await _context.SaveChangesAsync();

        return true;
    }
}
