
import {
  CheckCircle2,
  AlertCircle,
  Info,
  X,
} from "lucide-react";

function Toast({ toast, onDismiss }) {
  if (!toast) return null;

  return (
    <div
      key={toast.id}
      className={`toast-notification toast-${toast.type}`}
      role={toast.type === "error" ? "alert" : "status"}
      aria-live={toast.type === "error" ? "assertive" : "polite"}
    >
      <div className="toast-icon">
        {toast.type === "success" ? (
          <CheckCircle2 size={22} />
        ) : toast.type === "error" ? (
          <AlertCircle size={22} />
        ) : (
          <Info size={22} />
        )}
      </div>

      <div className="toast-content">
        <strong>{toast.title}</strong>
        <p>{toast.message}</p>
      </div>

      <button
        type="button"
        className="toast-close"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        <X size={17} />
      </button>

      <div className="toast-progress" />
    </div>
  );
}

export default Toast;
