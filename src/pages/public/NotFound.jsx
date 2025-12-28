import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const nav = useNavigate();
  return (
    <div className="container section">
      <h2 className="h2">Page not found</h2>
      <p className="p">The page doesn’t exist.</p>
      <button className="btn primary" style={{ marginTop: 14 }} onClick={() => nav("/")}>
        Go home
      </button>
    </div>
  );
}
