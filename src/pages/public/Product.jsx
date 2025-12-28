import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../../services/products.service";
import { addToCart } from "../../store/cart.store";

export default function Product() {
  const { productId } = useParams();
  const nav = useNavigate();
  const [p, setP] = useState(null);
  const [img, setImg] = useState(0);

  useEffect(() => {
    (async () => {
      const res = await getProductById(productId);
      setP(res);
    })();
  }, [productId]);

  if (!p) {
    return (
      <div className="container section">
        <div className="emptyHint">Loading...</div>
      </div>
    );
  }

  const images = Array.isArray(p.images) ? p.images : [];
  const cover = images[img] || "/sample.png";

  function add() {
    addToCart({ id: p.id, name: p.title, price: Number(p.price || 0), image: cover });
    window.__BEGORGEOUS_TOAST__?.("Added to cart");
  }

  return (
    <div className="container section">
      <div className="pageHead">
        <div>
          <h2 className="h2">{p.title}</h2>
          <p className="p">{p.categoryId}</p>
        </div>
        <button className="btn ghost" onClick={() => nav(-1)}>Back</button>
      </div>

      <div className="productGrid">
        <div className="productMedia">
          <img className="productImage" src={cover} alt={p.title} />
          <div className="thumbRow">
            {images.slice(0, 2).map((u, i) => (
              <button key={u} className={`thumb ${img === i ? "thumbActive" : ""}`} onClick={() => setImg(i)}>
                <img src={u} alt="thumb" />
              </button>
            ))}
          </div>
        </div>

        <div className="productInfo">
          <div className="price">₹{p.price}</div>
          <div className="desc">{p.description}</div>

          <div className="detailBox">
            <div className="detailRow"><span className="muted">Size</span><span>{p.size || "—"}</span></div>
            <div className="detailRow"><span className="muted">Care</span><span>{p.care || "—"}</span></div>
          </div>

          <div className="heroActions" style={{ marginTop: 14 }}>
            <button className="btn primary" onClick={add}>Add to cart</button>
            <button className="btn ghost" onClick={() => nav("/cart")}>Go to cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}
