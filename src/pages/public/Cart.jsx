import React, { useMemo, useState } from "react";
import { getCart, updateQty, clearCart } from "../../store/cart.store";

export default function Cart() {
  const [items, setItems] = useState(getCart());

  const total = useMemo(
    () => items.reduce((s, x) => s + Number(x.price || 0) * Number(x.qty || 0), 0),
    [items]
  );

  function change(id, qty) {
    setItems(updateQty(id, qty));
  }

  return (
    <div className="container section">
      <div className="pageHead">
        <div>
          <h2 className="h2">Cart</h2>
          <p className="p">Your selected items.</p>
        </div>
        <button className="btn ghost" onClick={() => { clearCart(); setItems([]); }}>
          Clear
        </button>
      </div>

      {items.length === 0 ? (
        <div className="emptyHint" style={{ marginTop: 16 }}>Cart is empty.</div>
      ) : (
        <div className="cartGrid">
          <div className="cartList">
            {items.map((x) => (
              <div key={x.id} className="cartItem">
                <img className="cartImg" src={x.image || "/sample.png"} alt={x.name} />
                <div className="cartInfo">
                  <div className="cartName">{x.name}</div>
                  <div className="muted">₹{x.price}</div>
                </div>

                <div className="qty">
                  <button className="qtyBtn" onClick={() => change(x.id, x.qty - 1)}>−</button>
                  <div className="qtyNum">{x.qty}</div>
                  <button className="qtyBtn" onClick={() => change(x.id, x.qty + 1)}>+</button>
                </div>
              </div>
            ))}
          </div>

          <div className="summary">
            <div className="sumTitle">Summary</div>
            <div className="sumRow"><span className="muted">Items</span><span>{items.reduce((a,b)=>a+b.qty,0)}</span></div>
            <div className="sumRow"><span className="muted">Total</span><span className="sumTotal">₹{total}</span></div>
            <button className="btn primary" style={{ width: "100%", marginTop: 12 }}>
              Checkout
            </button>
            <div className="muted" style={{ marginTop: 8, fontSize: 13 }}>
              (You can connect this button to WhatsApp order.)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
