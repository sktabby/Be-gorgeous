import React from "react";

export default function CategoryGrid({ cats = [], onOpenCategory }) {
  return (
    <section
      className="container section"
      id="collections"
      style={{
        margin: "clamp(10px, 2vw, 48px) auto",
        paddingLeft: "clamp(12px, 4vw, 0px)",
        paddingRight: "clamp(12px, 4vw, 0px)",
      }}
    >
      {/* HEADER */}
      <div style={{ marginBottom: 18 }}>
        <h2
          className="h2"
          style={{
            fontSize: "30px",
            fontWeight: 900,
            letterSpacing: "-0.015em",
            color: "#493628",
          }}
        >
          Collections
        </h2>

        <span
          style={{
            display: "inline-block",
            marginTop: 10,
            padding: "6px 14px",
            borderRadius: 999,
            background: "rgba(214, 192, 179, 0.45)",
            color: "#493628",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          Explore our jewellery
        </span>
      </div>

      {cats.length > 0 ? (
        <div className="catGridCompact">
          {cats.map((c) => (
            <button
              key={c.id}
              className="catCardCompact"
              onClick={() => onOpenCategory?.(c.id)}
              title={c.name}
              type="button"
            >
              {/* IMAGE (short banner) */}
              <div className="catImg">
                <img
                  src={c.imageUrl || "/sample.png"}
                  alt={c.name}
                  loading="lazy"
                  onError={(e) => (e.currentTarget.src = "/sample.png")}
                />
              </div>

              {/* CONTENT */}
              <div className="catContent">
                <div className="catTitle">{c.name}</div>
                <div className="catNote">
                  {c.note?.trim() ? c.note : "Explore premium picks"}
                </div>

                <div className="catCtaRow">
                  <span className="catCtaText">Explore</span>
                  <span className="catArrow">→</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div
          style={{
            marginTop: 40,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              maxWidth: 420,
              padding: 24,
              textAlign: "center",
              borderRadius: 22,
              border: "1px dashed rgba(171, 136, 109, 0.34)",
              background: "#fff",
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: "50%",
                background: "rgba(214, 192, 179, 0.55)",
                color: "#493628",
                display: "grid",
                placeItems: "center",
                fontSize: 22,
                fontWeight: 900,
                margin: "0 auto 16px",
              }}
            >
              ✨
            </div>

            <h3 style={{ fontWeight: 900, color: "#493628" }}>
              Collections coming soon
            </h3>
            <p
              style={{
                marginTop: 8,
                color: "rgba(73, 54, 40, 0.72)",
                lineHeight: 1.6,
              }}
            >
              Our team is curating beautiful jewellery categories.
            </p>
          </div>
        </div>
      )}

      <style>{`
        /* ✅ Compact grid: small cards on desktop, 2-column on mobile */
        .catGridCompact{
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .catCardCompact{
          padding: 0;
          border-radius: 18px;
          border: 1px solid rgba(73,54,40,0.12);
          background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(214,192,179,0.18));
          box-shadow: 0 14px 40px rgba(73,54,40,0.10);
          overflow: hidden;
          cursor: pointer;
          text-align: left;
          transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
        }

        .catCardCompact:hover{
          transform: translateY(-3px);
          box-shadow: 0 20px 55px rgba(73,54,40,0.14);
          border-color: rgba(171,136,109,0.26);
        }

        /* ✅ Banner image makes card shorter */
        .catImg{
          width: 100%;
          aspect-ratio: 16 / 10;
          background: rgba(214,192,179,0.25);
          overflow: hidden;
        }
        .catImg img{
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform .35s ease;
          filter: saturate(0.98) contrast(1.02);
        }
        .catCardCompact:hover .catImg img{
          transform: scale(1.06);
        }

        .catContent{
          padding: 12px 12px 12px;
        }

        .catTitle{
          font-weight: 900;
          color: #493628;
          letter-spacing: -0.01em;
          font-size: 15px;
          line-height: 1.15;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .catNote{
          margin-top: 6px;
          color: rgba(73,54,40,0.72);
          font-size: 12.6px;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: calc(12.6px * 1.35 * 2);
        }

        .catCtaRow{
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .catCtaText{
          font-weight: 900;
          color: #493628;
          font-size: 12.8px;
        }

        .catArrow{
          width: 30px;
          height: 30px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: rgba(214,192,179,0.55);
          color: #493628;
          font-weight: 900;
        }

        /* ✅ Desktop wide screens: 5 in a row */
        @media (min-width: 1180px){
          .catGridCompact{
            grid-template-columns: repeat(5, minmax(0, 1fr));
          }
        }

        /* ✅ Tablets: 3 in a row */
        @media (max-width: 980px){
          .catGridCompact{
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        /* ✅ Mobile: 2 in a row (compact) */
        @media (max-width: 560px){
          .catGridCompact{
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }
          .catContent{
            padding: 10px;
          }
          .catTitle{
            font-size: 14px;
          }
          .catNote{
            font-size: 12.2px;
          }
          .catArrow{
            width: 28px;
            height: 28px;
          }
        }
      `}</style>
    </section>
  );
}
