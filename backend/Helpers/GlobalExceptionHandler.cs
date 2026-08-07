using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Diagnostics;

namespace backend.Middlewares;
public class GlobalExceptionHandler : IExceptionHandler
{
  public async ValueTask<bool> TryHandleAsync(
      HttpContext httpContext,
      Exception exception,
      CancellationToken cancellationToken)
  {
    var problemDetails = new ProblemDetails
    {
      Status = StatusCodes.Status500InternalServerError,
      Title = "An error occurred",
      Detail = exception.Message
    };

    httpContext.Response.StatusCode = problemDetails.Status.Value;
    await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);
    return true;
  }
}
