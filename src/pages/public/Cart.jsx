import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCart, updateQty, clearCart, removeFromCart, setCart } from "../../store/cart.store.js";
import { openWhatsAppOrder } from "../../services/whatsapp.service.js";

// 🔥 Firestore analytics logging
import { addDoc, collection, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db } from "../../app/firebase/db.js"; // ✅ adjust path if needed

import { ROUTES } from "../../app/routes.js"; // ✅ adjust if your routes file path differs

export default function Cart() {
  const nav = useNavigate();
  const [items, setItems] = useState(getCart());

  const total = useMemo(
    () =>
      items.reduce((s, x) => s + Number(x.price || 0) * Number(x.qty || 0), 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((a, b) => a + Number(b.qty || 0), 0),
    [items]
  );

  function change(id, qty) {
    setItems(updateQty(id, qty));
  }

  function removeItem(id) {
    setItems(removeFromCart(id));
  }

  // ✅ helper: validate products exist (removes deleted ones)
  async function filterExistingProducts(cart) {
    const safe = Array.isArray(cart) ? cart : [];
    if (!safe.length) return { cleaned: [], removed: 0 };

    const checks = await Promise.all(
      safe.map(async (x) => {
        try {
          const id = String(x?.id || "");
          if (!id) return { ok: false };
          const snap = await getDoc(doc(db, "products", id));
          return { ok: snap.exists(), id };
        } catch {
          return { ok: false };
        }
      })
    );

    const existsSet = new Set(checks.filter((c) => c.ok).map((c) => c.id));
    const cleaned = safe.filter((x) => existsSet.has(String(x?.id || "")));
    const removed = safe.length - cleaned.length;

    return { cleaned, removed };
  }

  async function onCheckout() {
    let cart = getCart(); // ✅ always get latest cart

    // ✅ remove items that no longer exist in Firestore
    const { cleaned, removed } = await filterExistingProducts(cart);

    if (removed > 0) {
      setCart(cleaned);
      setItems(cleaned);
      cart = cleaned;
      alert(`${removed} item(s) were removed because the product no longer exists.`);
    }

    if (!cart.length) {
      alert("Cart is empty!");
      return;
    }

    // ✅ Log WhatsApp redirect analytics (non-blocking) — includes productId
    addDoc(collection(db, "analytics_events"), {
      type: "whatsapp_redirect",
      items: cart.map((x) => ({
        id: String(x.id || ""), // ✅ IMPORTANT: productId
        name: x.name || x.title || "Item",
        price: Number(x.price || 0),
        qty: Number(x.qty || 0),
      })),
      itemCount: cart.reduce((a, b) => a + Number(b.qty || 0), 0),
      total: cart.reduce((s, x) => s + Number(x.price || 0) * Number(x.qty || 0), 0),
      at: serverTimestamp(),
    }).catch(console.error);

    // ✅ Redirect to WhatsApp (use cleaned cart)
    openWhatsAppOrder(cart);

    // ✅ optional: clear cart after opening WhatsApp
    // clearCart();
    // setItems([]);
    // nav(ROUTES.HOME);
  }

  function onClear() {
    clearCart();
    setItems([]);
    nav(ROUTES.HOME); // ✅ redirect home after clearing
  }

  return (
    <div className="container section">
      {/* ✅ Single premium card wrapper */}
      <div className="cartCard">
        <div className="cartHead">
          <div>
            <h2 className="h2" style={{ margin: 0, color: "#493628" }}>
              Cart
            </h2>
            <p className="p" style={{ margin: "6px 0 0", color: "rgba(73,54,40,0.65)" }}>
              Your selected items.
            </p>
          </div>

          <button className="btn ghost cartClearBtn" onClick={onClear}>
            Clear
          </button>
        </div>

        {items.length === 0 ? (
          <div className="emptyHint" style={{ marginTop: 16 }}>
            Cart is empty.
          </div>
        ) : (
          <div className="cartInner">
            {/* LEFT: items */}
            <div className="cartListNice">
              {items.map((x) => (
                <div key={x.id} className="cartItemNice">
                  <img
                    className="cartImgNice"
                    src={x.image || x.img || x.img1 || "/sample.png"}
                    alt={x.name || "Item"}
                    loading="lazy"
                    onError={(e) => (e.currentTarget.src = "/sample.png")}
                  />

                  <div className="cartInfoNice">
                    <div className="cartNameNice" title={x.name || x.title || "Item"}>
                      {x.name || x.title || "Item"}
                    </div>
                    <div className="cartPriceNice">₹{x.price}</div>
                  </div>

                  <div className="qtyNice">
                    <button
                      className="qtyBtnNice"
                      onClick={() => change(x.id, Number(x.qty || 0) - 1)}
                      disabled={Number(x.qty || 0) <= 1}
                      title={Number(x.qty || 0) <= 1 ? "Minimum 1" : "Decrease"}
                      type="button"
                    >
                      −
                    </button>
                    <div className="qtyNumNice">{x.qty}</div>
                    <button
                      className="qtyBtnNice"
                      onClick={() => change(x.id, Number(x.qty || 0) + 1)}
                      type="button"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="delBtnNice"
                      onClick={() => removeItem(x.id)}
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M9 3h6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M5 6h14"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M7 6l1 14h8l1-14"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 11v6M14 11v6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: summary */}
            <div className="summaryNice">
              <div className="sumTitleNice">Summary</div>

              <div className="sumRowNice">
                <span className="muted">Items</span>
                <span style={{ fontWeight: 900, color: "#493628" }}>{itemCount}</span>
              </div>

              <div className="sumRowNice">
                <span className="muted">Total</span>
                <span className="sumTotalNice">₹{total}</span>
              </div>

              <button
                className="btn primary sumCheckoutBtn"
                style={{ width: "100%", marginTop: 12 }}
                onClick={onCheckout}
              >
                Checkout
              </button>

              <div className="sumNoteNice">
                You’ll be redirected to WhatsApp with your order details.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Premium styling inside same file (no separate CSS) */}
      <style>{`
        .cartCard{
          border-radius: 22px;
          border: 1px solid rgba(171, 136, 109, 0.22);
          background: rgba(255,255,255,0.60);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 18px 55px rgba(73, 54, 40, 0.12), inset 0 1px 0 rgba(255,255,255,0.55);
          padding: 16px;
        }

        .cartHead{
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(171, 136, 109, 0.16);
        }

        .cartClearBtn{
          border-radius: 999px;
          padding: 10px 14px;
          white-space: nowrap;
        }

        .cartInner{
          margin-top: 14px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }

        .cartListNice{
          display: grid;
          gap: 12px;
        }

        .cartItemNice{
          display: grid;
          grid-template-columns: 56px 1fr auto;
          gap: 12px;
          align-items: center;
          padding: 12px;
          border-radius: 18px;
          border: 1px solid rgba(73, 54, 40, 0.10);
          background: linear-gradient(180deg, rgba(255,255,255,0.78), rgba(214,192,179,0.16));
          box-shadow: 0 14px 34px rgba(73, 54, 40, 0.10);
        }

        .cartImgNice{
          width: 56px;
          height: 56px;
          border-radius: 14px;
          object-fit: cover;
          border: 1px solid rgba(171, 136, 109, 0.18);
          background: rgba(214,192,179,0.22);
          display: block;
        }

        .cartInfoNice{
          min-width: 0;
        }

        .cartNameNice{
          font-weight: 900;
          color: #493628;
          letter-spacing: -0.01em;
          font-size: 14.8px;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cartPriceNice{
          margin-top: 6px;
          font-weight: 900;
          color: rgba(73, 54, 40, 0.80);
          font-size: 13.8px;
        }

        .qtyNice{
          display: grid;
          grid-auto-flow: column;
          align-items: center;
          gap: 8px;
          padding: 6px;
          border-radius: 999px;
          border: 1px solid rgba(171, 136, 109, 0.18);
          background: rgba(255,255,255,0.55);
          box-shadow: 0 10px 22px rgba(73, 54, 40, 0.08);
        }

        .qtyBtnNice{
          width: 34px;
          height: 34px;
          border-radius: 999px;
          border: 1px solid rgba(73, 54, 40, 0.12);
          background: rgba(255,255,255,0.85);
          cursor: pointer;
          font-size: 18px;
          font-weight: 900;
          color: #493628;
          display: grid;
          place-items: center;
          transition: transform .12s ease, filter .12s ease;
        }

        .qtyBtnNice:hover{
          transform: translateY(-1px);
          filter: brightness(1.03);
        }

        .qtyBtnNice:disabled{
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .qtyNumNice{
          width: 26px;
          text-align: center;
          font-weight: 900;
          color: #493628;
        }

        .summaryNice{
          border-radius: 18px;
          border: 1px solid rgba(73, 54, 40, 0.10);
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 14px;
          box-shadow: 0 14px 40px rgba(73, 54, 40, 0.10);
        }

        .sumTitleNice{
          font-weight: 900;
          color: #493628;
          letter-spacing: -0.01em;
          font-size: 16px;
          margin-bottom: 10px;
        }

        .sumRowNice{
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          padding: 8px 0;
        }

        .sumTotalNice{
          font-weight: 900;
          color: #493628;
          font-size: 18px;
          letter-spacing: -0.01em;
        }

        .sumCheckoutBtn{
          border-radius: 999px;
          padding: 12px 14px;
          font-weight: 900;
          box-shadow: 0 14px 30px rgba(73, 54, 40, 0.18);
        }

        .sumNoteNice{
          margin-top: 10px;
          font-size: 13px;
          color: rgba(73, 54, 40, 0.60);
          line-height: 1.55;
        }

        @media (min-width: 900px){
          .cartCard{ padding: 18px; }
          .cartInner{
            grid-template-columns: 1.15fr 0.85fr;
            gap: 16px;
            align-items: start;
          }
          .summaryNice{
            position: sticky;
            top: 88px;
          }
        }

        @media (max-width: 420px){
          .cartCard{ padding: 14px; border-radius: 20px; }
          .cartItemNice{
            grid-template-columns: 52px 1fr auto;
            padding: 10px;
            border-radius: 16px;
          }
          .cartImgNice{ width: 52px; height: 52px; border-radius: 13px; }
          .qtyBtnNice{ width: 32px; height: 32px; }
          .sumCheckoutBtn{ padding: 11px 12px; font-size: 13px; }
        }

        .delBtnNice{
          width: 38px;
          height: 38px;
          border-radius: 20px;
          border: 1px solid rgba(185, 74, 74, 0.35);
          background: linear-gradient(
            180deg,
            rgba(255, 235, 235, 0.95),
            rgba(255, 210, 210, 0.85)
          );
          color: #9b2c2c;
          display: grid;
          place-items: center;
          cursor: pointer;
          box-shadow:
            0 10px 22px rgba(155, 44, 44, 0.18),
            inset 0 1px 0 rgba(255,255,255,0.6);
          transition:
            transform .14s ease,
            box-shadow .14s ease,
            filter .14s ease,
            color .14s ease;
        }

        .delBtnNice:hover{
          transform: translateY(-1.5px);
          color: #7f1d1d;
          box-shadow:
            0 16px 34px rgba(155, 44, 44, 0.26),
            inset 0 1px 0 rgba(255,255,255,0.7);
        }

        .delBtnNice:active{
          transform: translateY(0);
          box-shadow:
            0 8px 18px rgba(155, 44, 44, 0.22),
            inset 0 2px 6px rgba(155, 44, 44, 0.25);
        }

        .delBtnNice svg{
          transition: transform .14s ease;
        }

        .delBtnNice:hover svg{
          transform: scale(1.06);
        }

        @media (max-width: 420px){
          .delBtnNice{
            width: 36px;
            height: 36px;
            border-radius: 13px;
          }
        }
      `}</style>
    </div>
  );
}
