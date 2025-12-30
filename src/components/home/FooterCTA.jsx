import React from "react";

export default function FooterCTA({ onExplore, onFeatured }) {
  return (
    <footer
      className="container section"
      style={{
        marginTop: "clamp(40px, 6vw, 80px)",
        paddingLeft: "clamp(14px, 4vw, 0px)",
        paddingRight: "clamp(14px, 4vw, 0px)",
      }}
    >
      {/* FOOTER INNER */}
      <div
        style={{
          padding: "clamp(28px, 5vw, 48px) 0",
          borderTop: "1px solid rgba(171, 136, 109, 0.22)",
          borderBottom: "1px solid rgba(171, 136, 109, 0.22)",
        }}
      >
        {/* TOP ROW */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 14,
            marginBottom: 28,
          }}
        >
          <span
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              background: "rgba(214, 192, 179, 0.45)",
              color: "#493628",
              fontSize: 13,
              fontWeight: 700,
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          >
            Premium • Minimal • Elegant
          </span>

          <button
            className="btn ghost"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            ↑ Back to top
          </button>
        </div>

        {/* MAIN FOOTER CONTENT */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 32,
            alignItems: "start",
          }}
        >
          {/* LEFT — BRAND CTA */}
          <div>
            <h3
              style={{
                fontSize: "26px",
                fontWeight: 900,
                letterSpacing: "-0.015em",
                color: "#493628",
              }}
            >
              Find your next favorite piece
            </h3>

            <p
              style={{
                marginTop: 10,
                maxWidth: 520,
                lineHeight: 1.6,
                color: "rgba(73, 54, 40, 0.72)",
              }}
            >
              Explore curated collections, choose what you love, and place your
              order effortlessly through WhatsApp.
            </p>

            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 18,
                flexWrap: "wrap",
              }}
            >
              <button className="btn primary" onClick={onExplore}>
                Explore collections
              </button>
              <button className="btn ghost" onClick={onFeatured}>
                Featured picks
              </button>
            </div>
          </div>

          {/* RIGHT — INFO BLOCKS */}
          <div
            style={{
              display: "grid",
              gap: 16,
              fontSize: 14,
              color: "rgba(73, 54, 40, 0.72)",
            }}
          >
            <div>
              <strong style={{ color: "#493628" }}>Ordering</strong>
              <div>Cart → Checkout → WhatsApp</div>
            </div>

            <div>
              <strong style={{ color: "#493628" }}>Support</strong>
              <div>Quick replies on WhatsApp</div>
            </div>

            <div>
              <strong style={{ color: "#493628" }}>Contact</strong>
              <div>WhatsApp: +91 9XXXXXXXXX</div>
              <div>Email: support@begorgeous.in</div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER BOTTOM */}
      <div
        style={{
          padding: "18px 0",
          textAlign: "center",
          fontSize: 13,
          color: "rgba(73, 54, 40, 0.55)",
        }}
      >
        © {new Date().getFullYear()} BeGorgeous • Crafted with care
      </div>
    </footer>
  );
}
