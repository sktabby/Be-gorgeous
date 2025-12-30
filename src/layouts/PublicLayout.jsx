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
    [toast.open] // refresh count when toast happens (cart changes)
  );

  function showToast(text) {
    setToast({ open: true, text });
    window.clearTimeout(window.__bg_toast);
    window.__bg_toast = window.setTimeout(() => setToast({ open: false, text: "" }), 1400);
  }

  // make available globally for product cards
  window.__BEGORGEOUS_TOAST__ = showToast;

  return (
    <>
      <div className="frame">
        <div className="topbar">
          <div className="container nav">
            <div className="brand" onClick={() => nav(ROUTES.HOME)} role="button" tabIndex={0}>
              <img src={logo} alt="Begorgeous" className="brandLogo" />
              <div>
                <div className="brandTitle">Begorgeous</div>
                <div className="brandSub">Premium jewellery boutique</div>
              </div>
            </div>

            <div className="navLinks">
              <a href="/#collections">Collections</a>
              <a href="/#featured">Featured</a>
              <a href="/#care">Care</a>
            </div>

            <div className="navActions">
              <button className="btn ghost" onClick={() => nav(ROUTES.ADMIN_LOGIN)}>
                Add Products
              </button>

              <button className="btn primary" onClick={() => nav(ROUTES.CART)} aria-label="Cart">
                <span className="cartIcon">🛒</span>
                <span className="cartCount">{count}</span>
              </button>
            </div>
          </div>
        </div>

        <Outlet />

       
      </div>

      <Modal open={toast.open} text={toast.text} />
    </>
  );
}
