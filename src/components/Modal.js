"use client";
import { useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function Modal({ open, onClose, title, children, wide = false }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/60 p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true" aria-label={title}>
      <div className={`w-full ${wide ? "max-w-xl" : "max-w-md"} rounded-2xl bg-base-100 p-6 shadow-2xl`}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm" aria-label="Close"><FiX className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmModal({ open, onClose, onConfirm, title, text, confirmLabel = "Confirm", busy = false, danger = true }) {
  return (
    <Modal open={open} onClose={busy ? () => {} : onClose} title={title}>
      <p className="text-base-content/75">{text}</p>
      <div className="mt-6 flex justify-end gap-2">
        <button className="btn btn-ghost" onClick={onClose} disabled={busy}>Keep it</button>
        <button className={`btn ${danger ? "btn-error" : "btn-primary"}`} onClick={onConfirm} disabled={busy}>
          {busy && <span className="loading loading-spinner loading-sm" />}{confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
