import type { TodoDraft } from "../../types/TodoDraft.tsx";

type TodoTableDraftRowProps = {
  draft: TodoDraft;
  isUpdating?: boolean;
  isRemoving?: boolean;
};

export const TodoTableDraftRow = ({
  draft,
  isUpdating = false,
  isRemoving = false,
}: TodoTableDraftRowProps) => {

 return (
   <tr className="todo-table__row">
     <td className="todo-table__cell todo-table__cell--name">{draft.name}</td>
     <td className="todo-table__cell todo-table__cell--description">
       {draft.description}
     </td>
     <td className="todo-table__cell todo-table__cell--date">
       {draft.createdAt}
     </td>
     <td className="todo-table__cell todo-table__cell--actions">
       <div className="todo-table__actions">
         <button
           className="todo-table__action-button todo-table__action-button--cancel"
           onClick={() => {}}
         >
           Cancel
         </button>
       </div>
     </td>
   </tr>
 );
};
