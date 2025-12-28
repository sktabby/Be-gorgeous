import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ROUTES } from "../app/routes";
import { clearAdminAuthed } from "../store/admin.session";
import { adminSignOut } from "../app/firebase/auth";

export default function AdminLayout() {
  const nav = useNavigate();

  async function logout() {
    try { await adminSignOut(); } catch {}
    clearAdminAuthed();
    nav(ROUTES.HOME);
  }

  return (
    <div className="adminShell">
      <aside className="adminSide">
        <div className="adminBrand" onClick={() => nav(ROUTES.ADMIN_DASH)} role="button" tabIndex={0}>
          <div className="adminDot" />
          <div>
            <div className="adminTitle">Begorgeous Admin</div>
            <div className="adminSub">Manage store</div>
          </div>
        </div>

        <div className="adminMenu">
          <button className="adminBtn" onClick={() => nav(ROUTES.ADMIN_DASH)}>Dashboard</button>
          <button className="adminBtn" onClick={() => nav(ROUTES.ADMIN_CATEGORIES)}>Categories</button>
          <button className="adminBtn" onClick={() => nav(ROUTES.ADMIN_PRODUCTS)}>Products</button>
        </div>

        <button className="btn ghost" style={{ marginTop: "auto" }} onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="adminMain">
        <Outlet />
      </main>
    </div>
  );
}
