import React, { useMemo, useState } from "react";
import { getCart, updateQty, clearCart } from "../../store/cart.store.js";
import { openWhatsAppOrder } from "../../services/whatsapp.service.js"; // ✅ adjust path if needed

export default function Cart() {
  const [items, setItems] = useState(getCart());

  const total = useMemo(
    () =>
      items.reduce(
        (s, x) => s + Number(x.price || 0) * Number(x.qty || 0),
        0
      ),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((a, b) => a + Number(b.qty || 0), 0),
    [items]
  );

  function change(id, qty) {
    setItems(updateQty(id, qty));
  }

  function onCheckout() {
    const cart = getCart(); // ✅ always get latest cart
    openWhatsAppOrder(cart);

    // ✅ optional: clear cart after opening WhatsApp
    // clearCart();
    // setItems([]);
  }

  return (
    <div className="container section">
      <div className="pageHead">
        <div>
          <h2 className="h2">Cart</h2>
          <p className="p">Your selected items.</p>
        </div>
        <button
          className="btn ghost"
          onClick={() => {
            clearCart();
            setItems([]);
          }}
        >
          Clear
        </button>
      </div>

      {items.length === 0 ? (
        <div className="emptyHint" style={{ marginTop: 16 }}>
          Cart is empty.
        </div>
      ) : (
        <div className="cartGrid">
          <div className="cartList">
            {items.map((x) => (
              <div key={x.id} className="cartItem">
                <img
                  className="cartImg"
                  src={x.image || x.img || x.img1 || "/sample.png"}
                  alt={x.name || "Item"}
                />
                <div className="cartInfo">
                  <div className="cartName">{x.name || x.title || "Item"}</div>
                  <div className="muted">₹{x.price}</div>
                </div>

                <div className="qty">
                  <button
                    className="qtyBtn"
                    onClick={() => change(x.id, Number(x.qty || 0) - 1)}
                  >
                    −
                  </button>
                  <div className="qtyNum">{x.qty}</div>
                  <button
                    className="qtyBtn"
                    onClick={() => change(x.id, Number(x.qty || 0) + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="summary">
            <div className="sumTitle">Summary</div>
            <div className="sumRow">
              <span className="muted">Items</span>
              <span>{itemCount}</span>
            </div>
            <div className="sumRow">
              <span className="muted">Total</span>
              <span className="sumTotal">₹{total}</span>
            </div>

            <button
              className="btn primary"
              style={{ width: "100%", marginTop: 12 }}
              onClick={onCheckout} // ✅ WhatsApp redirect here
            >
              Checkout
            </button>

            <div className="muted" style={{ marginTop: 8, fontSize: 13 }}>
              You’ll be redirected to WhatsApp with your order details.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
