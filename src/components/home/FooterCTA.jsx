import React from "react";

export default function FooterCTA({ onExplore, onFeatured }) {
  return (
    <section
      className="container section"
      style={{
        margin: "clamp(20px, 4vw, 60px) auto",
        paddingLeft: "clamp(12px, 4vw, 0px)",
        paddingRight: "clamp(12px, 4vw, 0px)",
      }}
    >
      {/* CTA CARD */}
      <div
        style={{
          borderRadius: 26,
          padding: "clamp(20px, 4vw, 36px)",
          background: "#fff",
          border: "1px solid rgba(171, 136, 109, 0.20)",
          boxShadow: "0 18px 50px rgba(73, 54, 40, 0.10)",
        }}
      >
        {/* TOP BAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 22,
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

        {/* MAIN CONTENT */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 24,
            alignItems: "center",
          }}
        >
          {/* LEFT */}
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
              order effortlessly.
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

          {/* RIGHT — CONTACT & TRUST */}
          <div
            style={{
              display: "grid",
              gap: 14,
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

      {/* FOOTER NOTE */}
      <div
        style={{
          marginTop: 18,
          textAlign: "center",
          fontSize: 13,
          color: "rgba(73, 54, 40, 0.55)",
        }}
      >
        © {new Date().getFullYear()} BeGorgeous • Crafted with care
      </div>
    </section>
  );
}
