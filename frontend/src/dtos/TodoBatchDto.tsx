import type { TodoDto } from "./TodoDto";
import type { TodoBatchAction } from "../types/TodoBatchAction";

export interface TodoBatchOperationDraftDto {
  clientId: string;
  action: TodoBatchAction;
  todoId?: string;
  createdAt?: string;
  name: string;
  description: string;
}

export type TodoBatchOperationRequestDto =
  | {
      clientId: string;
      action: "add";
      name: string;
      description: string;
    }
  | {
      clientId: string;
      action: "update";
      todoId: string;
      name: string;
      description: string;
    }
  | {
      clientId: string;
      action: "remove";
      todoId: string;
    };

export interface TodoBatchRequestDto {
  operations: TodoBatchOperationRequestDto[];
}

export interface TodoBatchOperationResultDto {
  clientId: string;
  action: TodoBatchAction;
  isSucceeded: boolean;
  errorMessage: string;
  todo?: TodoDto;
  todoId?: string;
}
