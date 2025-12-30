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
    <>
      <div className="pCard premiumCard">
        <button
          className="pImgWrap premiumImgWrap"
          onClick={() => nav(`/product/${p.id}`)}
          aria-label="View product"
          type="button"
        >
          <img className="pImg premiumImg" src={cover} alt={p.title} loading="lazy" />
        </button>

        <div className="pBody premiumBody">
          <div className="pTop premiumTop">
            <div className="pTitle premiumTitle" title={p.title}>
              {p.title}
            </div>
            <div className="pPrice premiumPrice">₹{p.price}</div>
          </div>

          {/* ✅ Removed categoryId pill completely (no random ids on UI) */}
          <div className="pMeta premiumMeta">
            {p.size ? <span className="premiumSize">{p.size}</span> : <span />}
          </div>

          <div className="pActions premiumActions">
            <button className="btn primary pBtn premiumBtn" onClick={add} type="button">
              Add to cart
            </button>
            <button
              className="btn ghost pBtn premiumBtn"
              onClick={() => nav(`/product/${p.id}`)}
              type="button"
            >
              View
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Premium, aligned, smaller on mobile (no separate CSS file) */}
      <style>{`
        .premiumCard{
          border-radius: 20px;
          border: 1px solid rgba(73, 54, 40, 0.12);
          background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(214,192,179,0.18));
          box-shadow: 0 16px 45px rgba(73, 54, 40, 0.10);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .premiumImgWrap{
          width: 100%;
          padding: 0;
          border: 0;
          background: transparent;
          cursor: pointer;
        }

        /* Image becomes a clean banner (reduces height a LOT) */
        .premiumImg{
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          aspect-ratio: 4 / 3;
          background: rgba(214,192,179,0.22);
          transition: transform .35s ease, filter .35s ease;
          filter: saturate(0.98) contrast(1.02);
        }

        .premiumCard:hover .premiumImg{
          transform: scale(1.04);
          filter: saturate(1.02) contrast(1.04);
        }

        .premiumBody{
          padding: 12px 12px 12px;
        }

        .premiumTop{
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 10px;
          align-items: start;
        }

        .premiumTitle{
          font-weight: 900;
          color: #493628;
          letter-spacing: -0.01em;
          line-height: 1.15;
          font-size: 15px;

          /* neat clamp */
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: calc(15px * 1.15 * 2);
        }

        .premiumPrice{
          font-weight: 900;
          color: #493628;
          white-space: nowrap;
          font-size: 15px;
        }

        .premiumMeta{
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 18px;
        }

        .premiumSize{
          font-size: 12.5px;
          color: rgba(73, 54, 40, 0.65);
        }

        .premiumActions{
          margin-top: 12px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          align-items: center;
        }

        .premiumBtn{
          width: 100%;
          border-radius: 999px;
          padding: 10px 12px;
          font-weight: 800;
        }

        /* ✅ Smaller & tighter for mobile */
        @media (max-width: 560px){
          .premiumCard{
            border-radius: 18px;
          }

          .premiumImg{
            aspect-ratio: 16 / 11; /* shorter image on mobile */
          }

          .premiumBody{
            padding: 10px;
          }

          .premiumTitle{
            font-size: 14px;
            min-height: calc(14px * 1.15 * 2);
          }

          .premiumPrice{
            font-size: 14px;
          }

          .premiumBtn{
            padding: 9px 10px;
            font-size: 13px;
          }

          .premiumActions{
            gap: 8px;
          }
        }
      `}</style>
    </>
  );
}
