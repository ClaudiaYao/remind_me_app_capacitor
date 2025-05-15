interface PromptDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
}

const PromptDialog = ({ open, onConfirm, onCancel, message }: PromptDialogProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-0 flex items-center justify-center bg-black/75">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <p className="mb-4">{message || "You have unsaved changes. Are you sure you want to leave?"}</p>
        <div className="flex justify-end space-x-4">
          <button onClick={onCancel} className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
            Stay
          </button>
          <button onClick={onConfirm} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
            Leave
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptDialog;
