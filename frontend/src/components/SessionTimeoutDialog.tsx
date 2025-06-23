type Props = {
  show: boolean;
  onStayLoggedIn: () => void;
};

export default function SessionTimeoutDialog({ show, onStayLoggedIn }: Props) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded shadow max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-2">Session Timeout Warning</h2>
        <p className="mb-4">You’ve been inactive for a while. You will be logged out in 1 minute.</p>
        <div className="flex justify-end space-x-2">
          <button onClick={onStayLoggedIn} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
}
