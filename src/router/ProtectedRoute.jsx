import React from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "../app/routes";
import { isAdminAuthed } from "../store/admin.session";

export default function ProtectedRoute({ children }) {
  if (!isAdminAuthed()) return <Navigate to={ROUTES.ADMIN_LOGIN} replace />;
  return children;
}
