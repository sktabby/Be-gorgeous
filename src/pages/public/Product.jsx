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
      {/* Premium glass card wrapper */}
      <div className="pViewCard">
        <div className="pViewHead">
          <div className="pViewTitleWrap">
            <h2 className="h2 pViewTitle">{p.title}</h2>
            <p className="p pViewSub">{p.categoryId}</p>
          </div>

          <button className="btn ghost pViewBack" onClick={() => nav(-1)} type="button">
            Back
          </button>
        </div>

        <div className="pViewGrid">
          {/* MEDIA */}
          <div className="pViewMedia">
            <div className="pViewImgFrame">
              <img className="pViewImg" src={cover} alt={p.title} />
            </div>

            <div className="pViewThumbRow">
              {images.slice(0, 2).map((u, i) => (
                <button
                  key={u}
                  className={`pViewThumb ${img === i ? "pViewThumbActive" : ""}`}
                  onClick={() => setImg(i)}
                  type="button"
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={u} alt="thumb" />
                </button>
              ))}
            </div>
          </div>

          {/* INFO */}
          <div className="pViewInfo">
            {/* ✅ ORDER: Price → Actions → Description → Details */}
            <div className="pViewPrice">₹{p.price}</div>

            <div className="heroActions pViewActions premiumActionBlock" style={{ marginTop: 12 }}>
              <button className="btn primary pViewBtn" onClick={add} type="button">
                Add to cart
              </button>
              <button className="btn ghost pViewBtn" onClick={() => nav("/cart")} type="button">
                Go to cart
              </button>
            </div>

            <div className="pViewDesc premiumDesc">{p.description}</div>

            <div className="pViewDetails">
              <div className="pViewDetailRow">
                <span className="muted">Size</span>
                <span className="pViewDetailVal">{p.size || "—"}</span>
              </div>
              <div className="pViewDetailRow">
                <span className="muted">Care</span>
                <span className="pViewDetailVal">{p.care || "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium + mobile fit styling */}
      <style>{`
        .pViewCard{
          border-radius: 22px;
          border: 1px solid rgba(171, 136, 109, 0.22);
          background: rgba(255,255,255,0.60);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 18px 55px rgba(73, 54, 40, 0.12), inset 0 1px 0 rgba(255,255,255,0.55);
          padding: 16px;
        }

        .pViewHead{
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(171, 136, 109, 0.16);
          margin-bottom: 14px;
        }

        .pViewTitleWrap{ min-width: 0; }
        .pViewTitle{
          margin: 0;
          font-size: clamp(20px, 3.6vw, 30px);
          letter-spacing: -0.02em;
          color: #493628;
        }
        .pViewSub{
          margin: 6px 0 0;
          color: rgba(73, 54, 40, 0.62);
        }

        .pViewBack{
          border-radius: 999px;
          padding: 10px 14px;
          white-space: nowrap;
        }

        .pViewGrid{
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }

        /* media */
        .pViewImgFrame{
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(73, 54, 40, 0.12);
          background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(214,192,179,0.16));
          box-shadow: 0 16px 45px rgba(73, 54, 40, 0.10);
        }
        .pViewImg{
          width: 100%;
          display: block;
          object-fit: cover;
          aspect-ratio: 16 / 12;
          filter: saturate(0.98) contrast(1.02);
        }

        .pViewThumbRow{
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
        .pViewThumb{
          width: 64px;
          height: 52px;
          border-radius: 14px;
          border: 1px solid rgba(73, 54, 40, 0.12);
          background: rgba(255,255,255,0.55);
          overflow: hidden;
          cursor: pointer;
          padding: 0;
          box-shadow: 0 10px 22px rgba(73, 54, 40, 0.10);
          transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease;
        }
        .pViewThumb img{
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .pViewThumbActive{
          border-color: rgba(171, 136, 109, 0.55);
          box-shadow: 0 14px 28px rgba(73, 54, 40, 0.14);
          transform: translateY(-1px);
        }

        /* info */
        .pViewInfo{
          border-radius: 18px;
          border: 1px solid rgba(73, 54, 40, 0.10);
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 14px;
          box-shadow: 0 14px 40px rgba(73, 54, 40, 0.10);
        }

        .pViewPrice{
          font-size: 22px;
          font-weight: 900;
          color: #493628;
          letter-spacing: -0.01em;
        }

        .premiumActionBlock{
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(171, 136, 109, 0.18);
        }

        .pViewActions{
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .pViewBtn{
          width: 100%;
          border-radius: 999px;
          padding: 11px 12px;
          font-weight: 800;
        }

        .premiumDesc{
          margin-top: 14px;
          color: rgba(73, 54, 40, 0.72);
          line-height: 1.7;
          font-size: 14.6px;
        }

        .pViewDetails{
          margin-top: 12px;
          padding: 12px;
          border-radius: 16px;
          border: 1px solid rgba(171, 136, 109, 0.18);
          background: linear-gradient(180deg, rgba(255,255,255,0.70), rgba(214,192,179,0.18));
        }

        .pViewDetailRow{
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 14px;
          padding: 8px 2px;
        }
        .pViewDetailRow + .pViewDetailRow{
          border-top: 1px solid rgba(171, 136, 109, 0.14);
        }
        .pViewDetailVal{
          color: #493628;
          font-weight: 800;
          text-align: right;
          max-width: 60%;
          word-break: break-word;
        }

        /* Desktop: two columns */
        @media (min-width: 900px){
          .pViewCard{ padding: 18px; }
          .pViewGrid{
            grid-template-columns: 1.05fr 0.95fr;
            gap: 18px;
            align-items: start;
          }
          .pViewImg{ aspect-ratio: 1 / 1; }
        }

        /* Small mobile tighter */
        @media (max-width: 420px){
          .pViewCard{ padding: 14px; }
          .pViewThumb{ width: 58px; height: 48px; }
          .pViewPrice{ font-size: 20px; }
          .pViewBtn{ padding: 10px 10px; font-size: 13px; }
          .pViewActions{ gap: 8px; }
        }
      `}</style>
    </div>
  );
}
