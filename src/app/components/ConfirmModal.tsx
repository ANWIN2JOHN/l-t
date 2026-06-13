import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, X } from "lucide-react";

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "warning" | "danger" | "success";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onCancel, 250);
  };

  const handleConfirm = () => {
    setVisible(false);
    setTimeout(onConfirm, 250);
  };

  const getColors = () => {
    switch (type) {
      case "danger":
        return {
          icon: <AlertCircle size={48} className="text-red-500" />,
          iconBg: "bg-red-50",
          confirmBg: "bg-red-600 hover:bg-red-700",
        };
      case "success":
        return {
          icon: <CheckCircle size={48} className="text-emerald-500" />,
          iconBg: "bg-emerald-50",
          confirmBg: "bg-emerald-600 hover:bg-emerald-700",
        };
      default:
        return {
          icon: <AlertCircle size={48} className="text-amber-500" />,
          iconBg: "bg-amber-50",
          confirmBg: "bg-cyan-600 hover:bg-cyan-700",
        };
    }
  };

  const colors = getColors();

  return (
    <div
      onClick={handleClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        background: visible ? "rgba(15,23,42,0.6)" : "rgba(15,23,42,0)",
        backdropFilter: visible ? "blur(8px)" : "blur(0px)",
        transition: "all 0.25s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.15)",
          width: "100%",
          maxWidth: "440px",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.95) translateY(10px)",
          transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          style={{ position: "absolute" }}
        >
          <X size={20} className="text-gray-400" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className={`${colors.iconBg} p-4 rounded-full`}>
              {colors.icon}
            </div>
          </div>

          {/* Title */}
          <h2
            className="text-gray-900 font-bold text-xl mb-3"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            {title}
          </h2>

          {/* Message */}
          <p
            className="text-gray-600 text-sm leading-relaxed mb-8"
            style={{ fontFamily: "DM Sans, sans-serif", whiteSpace: "pre-line" }}
          >
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-sm transition-all"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 py-3 px-4 rounded-xl text-white font-semibold text-sm transition-all shadow-sm ${colors.confirmBg}`}
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
