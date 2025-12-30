import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ROUTES } from "../app/routes";
import { clearAdminAuthed } from "../store/admin.session";
import { adminSignOut } from "../app/firebase/auth";

export default function AdminLayout() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  async function logout() {
    try { await adminSignOut(); } catch {}
    clearAdminAuthed();
    nav(ROUTES.HOME);
  }

  // Close drawer when route changes (optional)
  function go(path) {
    nav(path);
    setOpen(false);
  }

  // ESC closes drawer on mobile
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={`adminShell ${open ? "adminOpen" : ""}`}>
      {/* ✅ MOBILE TOP BAR (only visible on mobile) */}
      <div className="adminMobileBar">
        <button className="adminHamburger" onClick={() => setOpen(true)} aria-label="Open menu">
          ☰
        </button>

        <div
          className="adminMobileTitle"
          onClick={() => nav(ROUTES.ADMIN_DASH)}
          role="button"
          tabIndex={0}
        >
          Begorgeous Admin
        </div>
      </div>

      {/* ✅ MOBILE OVERLAY (only visible on mobile + open) */}
      <div className="adminOverlay" onClick={() => setOpen(false)} />

      {/* ✅ SIDEBAR (DESKTOP stays exactly same; mobile becomes drawer via CSS) */}
      <aside className="adminSide">
        <div
          className="adminBrand"
          onClick={() => go(ROUTES.ADMIN_DASH)}
          role="button"
          tabIndex={0}
        >
          <div className="adminDot" />
          <div>
            <div className="adminTitle">Begorgeous Admin</div>
            <div className="adminSub">Manage store</div>
          </div>
        </div>

        <div className="adminMenu">
          <button className="adminBtn" onClick={() => go(ROUTES.ADMIN_DASH)}>Dashboard</button>
          <button className="adminBtn" onClick={() => go(ROUTES.ADMIN_CATEGORIES)}>Categories</button>
          <button className="adminBtn" onClick={() => go(ROUTES.ADMIN_PRODUCTS)}>Products</button>

          {/* ✅ Logout just below Products */}
          <button
  className="adminBtn"
  onClick={logout}
  style={{
    marginTop: 10,
    padding: "12px 14px",
    borderRadius: 14,

    /* 🤎 brown antique theme */
    background:
      "linear-gradient(180deg, #6b4a2f 0%, #4a2f1b 100%)",
    border: "1px solid rgba(214, 192, 179, 0.45)",

    fontWeight: 900,
    letterSpacing: "-0.01em",
    color: "#fffaf6",

    /* soft luxury glow */
    boxShadow:
      "0 14px 34px rgba(73,54,40,0.35), inset 0 1px 0 rgba(255,255,255,0.18)",

    cursor: "pointer",
    transition: "transform .15s ease, box-shadow .15s ease, filter .15s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-1px)";
    e.currentTarget.style.filter = "brightness(1.06)";
    e.currentTarget.style.boxShadow =
      "0 20px 44px rgba(216, 191, 173, 0.45), inset 0 1px 0 rgba(255,255,255,0.22)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.filter = "brightness(1)";
    e.currentTarget.style.boxShadow =
      "0 14px 34px rgba(132, 109, 93, 0.35), inset 0 1px 0 rgba(255,255,255,0.18)";
  }}
>
  Logout
</button>

        </div>
      </aside>

      <main className="adminMain">
        <Outlet />
      </main>

      {/* ✅ Only mobile overrides (desktop untouched) */}
      <style>{`
        /* ---------- Mobile header ---------- */
        .adminMobileBar{
  display:none;
  position: sticky;
  top: 0;
  z-index: 50;

  /* ✅ FIXED HEIGHT */
  height: 64px;
  min-height: 64px;
  max-height: 64px;
  box-sizing: border-box;

  background: rgba(255,255,255,0.55);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  border-bottom: 1px solid rgba(171, 136, 109, 0.22);
  box-shadow: 0 10px 30px rgba(73,54,40,0.06);

  /* ✅ keep content centered inside fixed height */
  padding: 0 14px;
  align-items: center;
  gap: 12px;
}

.adminMobileTitle{
  font-weight: 900;
  color: #493628;
  letter-spacing: -0.01em;
  cursor: pointer;

  /* ✅ prevent height changes */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1;
}

        .adminHamburger{
          width: 42px;
          height: 42px;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.12);
          background: #fff;
          font-size: 20px;
          cursor: pointer;
        }
        .adminMobileTitle{
          font-weight: 900;
          color: #493628;
          letter-spacing: -0.01em;
          cursor: pointer;
        }

        /* ---------- Overlay (mobile only) ---------- */
        .adminOverlay{
          display:none;
        }

        /* ✅ Mobile drawer behavior */
        @media (max-width: 899px){
          .adminMobileBar{ display:flex; }

          /* stop any desktop margin-left pushing */
          .adminMain{ margin-left: 0 !important; }

          /* overlay only when open */
          .adminOverlay{
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.45);
            z-index: 80;
          }
          .adminShell.adminOpen .adminOverlay{
            display:block;
          }

          /* sidebar becomes drawer */
          .adminSide{
            position: fixed !important;
            top: 0;
            left: 0;
            height: 100vh;
            width: 280px;
            background: #fff;
            z-index: 90;
            transform: translateX(-110%);
            transition: transform 0.25s ease;
            box-shadow: 0 22px 70px rgba(0,0,0,0.18);
          }
          .adminShell.adminOpen .adminSide{
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
