using System.Linq.Expressions;

namespace backend.Helpers;

public sealed class ParameterReplacer : ExpressionVisitor
{
  private readonly ParameterExpression _from;
  private readonly ParameterExpression _to;

  public ParameterReplacer(ParameterExpression from, ParameterExpression to)
  {
    _from = from;
    _to = to;
  }

  protected override Expression VisitParameter(ParameterExpression node)
  {
    return node == _from ? _to : base.VisitParameter(node);
  }
}

public static class ExpressionExtensions
{
  public static Expression<Func<T, bool>> AndAlso<T>(
      this Expression<Func<T, bool>> first,
      Expression<Func<T, bool>> second
  )
  {
    Expression secondBody = new ParameterReplacer(
        second.Parameters[0],
        first.Parameters[0]
    ).Visit(second.Body)!;

    return Expression.Lambda<Func<T, bool>>(
        Expression.AndAlso(first.Body, secondBody),
        first.Parameters[0]
    );
  }
}
