export type TodoDraft = {
  id?: string;
  clientId: string;
  name: string;
  description: string;
  createdAt?: string;
  action: "add" | "update" | "remove";
};
