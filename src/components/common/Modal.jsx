import React from "react";

export default function Modal({ open, text }) {
  if (!open) return null;
  return (
    <div className="toast">
      <div className="toastInner">{text}</div>
    </div>
  );
}
