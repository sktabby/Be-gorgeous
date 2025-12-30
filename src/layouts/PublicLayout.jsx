import React, { useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ROUTES } from "../app/routes";
import { getCart } from "../store/cart.store";
import Modal from "../components/common/Modal";
import logo from "../assets/images/logo1.jpeg";

export default function PublicLayout() {
  const nav = useNavigate();
  const [toast, setToast] = useState({ open: false, text: "" });

  const count = useMemo(
    () => getCart().reduce((a, b) => a + (b.qty || 0), 0),
    [toast.open]
  );

  function showToast(text) {
    setToast({ open: true, text });
    window.clearTimeout(window.__bg_toast);
    window.__bg_toast = window.setTimeout(
      () => setToast({ open: false, text: "" }),
      1400
    );
  }

  // make available globally for product cards
  window.__BEGORGEOUS_TOAST__ = showToast;

  return (
    <>
      <div className="frame">
        <div className="topbar">
          {/* ✅ added headerInner class ONLY */}
          <div className="container nav headerInner">
            <div
              className="brand"
              onClick={() => nav(ROUTES.HOME)}
              role="button"
              tabIndex={0}
            >
              <img src={logo} alt="Begorgeous" className="brandLogo" />
              <div>
                <div className="brandTitle">Begorgeous</div>
                <div className="brandSub">Premium jewellery </div>
              </div>
            </div>

            <div className="navLinks">
              <a href="/#collections">Collections</a>
              <a href="/#featured">Featured</a>
              <a href="/#care">Care</a>
            </div>

            <div className="navActions">
              <button
                className="btn ghost"
                onClick={() => nav(ROUTES.ADMIN_LOGIN)}
              >
                Add Products
              </button>

              {/* PREMIUM CART BUTTON (unchanged) */}
              <button
                className="btn primary"
                onClick={() => nav(ROUTES.CART)}
                aria-label="Cart"
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 18px",
                  borderRadius: 999,
                  background: "linear-gradient(180deg, #AB886D, #7B563B)",
                  border: "1px solid rgba(171,136,109,0.35)",
                  boxShadow:
                    "0 12px 28px rgba(73,54,40,0.28), inset 0 1px 0 rgba(255,255,255,0.25)",
                  color: "#fff",
                  fontWeight: 800,
                }}
              >
                <span
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: 22,
                    height: 22,
                  }}
                  aria-hidden
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                  </svg>
                </span>

                {count > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      minWidth: 22,
                      height: 22,
                      padding: "0 6px",
                      borderRadius: 999,
                      background:
                        "linear-gradient(180deg, #FFF5EC, #EAD6C4)",
                      color: "#493628",
                      fontSize: 12,
                      fontWeight: 900,
                      display: "grid",
                      placeItems: "center",
                      border: "1px solid rgba(171,136,109,0.45)",
                      boxShadow: "0 6px 16px rgba(73,54,40,0.25)",
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <Outlet />
      </div>

      <Modal open={toast.open} text={toast.text} />

      {/* ✅ ONLY THE REQUIRED FIXES */}
      <style>{`
        /* Mobile padding for header inner content */
        @media (max-width: 640px){
          .headerInner{
            padding-left: 14px !important;
            padding-right: 14px !important;
          }
        }

        /* Fix anchor scroll hiding under navbar */
        #collections,
        #featured,
        #care{
          scroll-margin-top: 90px;
        }

        @media (max-width: 640px){
          #collections,
          #featured,
          #care{
            scroll-margin-top: 110px;
          }
        }
      `}</style>
    </>
  );
}
