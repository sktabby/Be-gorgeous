export default function CategoryGrid({ cats, onOpenCategory }) {
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
      {/* BEAUTIFUL HEADER (HERO-LIKE) */}
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

      {/* CATEGORY ROW */}
      {cats.length > 0 ? (
        <div className="rowScroll">
          {cats.map((c) => (
            <button
              key={c.id}
              className="catCard"
              onClick={() => onOpenCategory(c.id)}
              title={c.name}
              style={{
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-3px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <div className="catTop">
                <div className="catName">{c.name}</div>
                <div className="catArrow">→</div>
              </div>

              <div className="catNote">{c.note || "Explore premium picks"}</div>
            </button>
          ))}
        </div>
      ) : (
        /* EMPTY STATE */
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
    </section>
  );
}
