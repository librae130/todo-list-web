import type { TodoDto } from "../dtos/TodoDto";

export const compareTodo = (left: TodoDto, right: TodoDto) => {
  const nameCompare = left.name.localeCompare(right.name);

  if (nameCompare !== 0) {
    return nameCompare;
  }

  const descriptionCompare = left.description.localeCompare(right.description);

  if (descriptionCompare !== 0) {
    return descriptionCompare;
  }

  return left.createdAt.localeCompare(right.createdAt);
};
