import React from "react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../store/cart.store";

export default function ProductCard({ p }) {
  const nav = useNavigate();
  const cover = (p.images && p.images[0]) || "/sample.png";

  function add() {
    addToCart({ id: p.id, name: p.title, price: Number(p.price || 0), image: cover });
    window.__BEGORGEOUS_TOAST__?.("Added to cart");
  }

  return (
    <div className="pCard">
      <button className="pImgWrap" onClick={() => nav(`/product/${p.id}`)} aria-label="View product">
        <img className="pImg" src={cover} alt={p.title} />
      </button>

      <div className="pBody">
        <div className="pTop">
          <div className="pTitle" title={p.title}>{p.title}</div>
          <div className="pPrice">₹{p.price}</div>
        </div>

        <div className="pMeta">
          <span className="pillSmall">{p.categoryId}</span>
          <span className="muted">{p.size || ""}</span>
        </div>

        <div className="pActions">
          <button className="btn primary pBtn" onClick={add}>Add to cart</button>
          <button className="btn ghost pBtn" onClick={() => nav(`/product/${p.id}`)}>View</button>
        </div>
      </div>
    </div>
  );
}
