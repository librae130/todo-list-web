type CreateButtonProps = {
  buttonName: string;
  onClickCreate: () => void;
};

export const CreateButton = ({ buttonName, onClickCreate }: CreateButtonProps) => {
  return (
    <button
      className="create-button"
      type="button"
      onClick={onClickCreate}
    >
      {buttonName || "Create"}
    </button>
  );
};
