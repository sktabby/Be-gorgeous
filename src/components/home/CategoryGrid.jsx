import React from "react";

export default function CategoryGrid({ cats = [], onOpenCategory }) {
  return (
    <section
      className="container section"
      id="collections"
      style={{
        margin: "clamp(10px, 2vw, 60px) auto",
        paddingLeft: "clamp(12px, 4vw, 0px)",
        paddingRight: "clamp(12px, 4vw, 0px)",
      }}
    >
      {/* HEADER */}
      <div style={{ marginBottom: 20 }}>
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

      {cats?.length > 0 ? (
        <div className="rowScroll catsRow">
          {cats.map((c) => (
            <button
              key={c.id}
              className="catCardMini"
              onClick={() => onOpenCategory?.(c.id)}
              title={c.name}
              type="button"
            >
              {/* LEFT: DP ICON */}
              <div className="catDpWrap" aria-hidden="true">
                <img
                  className="catDp"
                  src={c.imageUrl || "/sample.png"}
                  alt=""
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "/sample.png";
                  }}
                />
              </div>

              {/* CENTER: TEXT */}
              <div className="catText">
                <div className="catNameRow">{c.name}</div>
                <div className="catNoteRow">
                  {c.note?.trim() ? c.note : "Explore premium picks"}
                </div>
              </div>

              {/* RIGHT: ARROW */}
              <div className="catGo" aria-hidden="true">
                →
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div
          style={{
            marginTop: 48,
            display: "flex",
            justifyContent: "center",
            animation: "fadeUp 0.6s ease",
          }}
        >
          <div
            style={{
              maxWidth: 420,
              padding: 28,
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
              Our team is curating beautiful jewellery categories. Please check
              back shortly.
            </p>
          </div>

          <style>{`
            @keyframes fadeUp {
              from { opacity: 0; transform: translateY(14px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}

      <style>{`
        .catsRow{
          gap: 12px;
          padding-bottom: 6px;
        }

        .catCardMini{
          display: flex;
          align-items: center;
          gap: 12px;
          width: min(460px, 86vw);
          min-width: 320px;
          padding: 12px 12px;
          border-radius: 18px;
          border: 1px solid rgba(73, 54, 40, 0.10);
          background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(214,192,179,0.18));
          box-shadow: 0 14px 40px rgba(73, 54, 40, 0.10);
          cursor: pointer;
          transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
          text-align: left;
        }

        .catCardMini:hover{
          transform: translateY(-3px);
          box-shadow: 0 18px 55px rgba(73, 54, 40, 0.14);
          border-color: rgba(171, 136, 109, 0.24);
        }

        .catDpWrap{
          width: 52px;
          height: 52px;
          border-radius: 999px;
          padding: 2px;
          background: radial-gradient(60% 60% at 30% 20%, rgba(214,192,179,0.8), rgba(171,136,109,0.35));
          box-shadow: 0 10px 22px rgba(73, 54, 40, 0.16);
          flex: 0 0 auto;
        }

        .catDp{
          width: 100%;
          height: 100%;
          border-radius: 999px;
          object-fit: cover;
          display: block;
          border: 1px solid rgba(255,255,255,0.65);
          filter: saturate(0.95) contrast(1.02);
        }

        .catText{
          min-width: 0;
          flex: 1 1 auto;
        }

        .catNameRow{
          font-weight: 900;
          color: #493628;
          letter-spacing: -0.01em;
          font-size: 15.5px;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .catNoteRow{
          margin-top: 4px;
          color: rgba(73, 54, 40, 0.72);
          font-size: 12.8px;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .catGo{
          width: 36px;
          height: 36px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: rgba(214, 192, 179, 0.55);
          color: #493628;
          font-weight: 900;
          flex: 0 0 auto;
        }

        @media (max-width: 560px){
          .catCardMini{
            min-width: 280px;
            padding: 11px;
          }
          .catDpWrap{
            width: 48px;
            height: 48px;
          }
        }
      `}</style>
    </section>
  );
}
