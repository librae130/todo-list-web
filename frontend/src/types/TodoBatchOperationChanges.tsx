import type { TodoBatchOperationDraftDto } from "../dtos/TodoBatchDto";

export type TodoBatchOperationChanges = Partial<
  Pick<TodoBatchOperationDraftDto, "name" | "description">
>;
