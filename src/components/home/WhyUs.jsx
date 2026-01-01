import React from "react";

const items = [
  {
    t: "Anti-Tarnish Care",
    d: "Wipe gently after use, and store in a dry pouch. This keeps the coating fresh and the shine intact.",
  },
  {
    t: "Premium Packaging",
    d: "Every order arrives in a gift-ready box with secure protection—perfect for gifting and safe for daily storage.",
  },
 
  {
    t: "Easy Ordering",
    d: "Add to cart → checkout → send on WhatsApp. We confirm your details and you’re done—simple and quick.",
  },
];

export default function WhyUs() {
  return (
    <section
      className="container section"
      id="care"
      style={{
        margin: "clamp(10px, 2vw, 60px) auto",
        paddingLeft: "clamp(12px, 4vw, 0px)",
        paddingRight: "clamp(12px, 4vw, 0px)",
      }}
    >
      {/* HEADER */}
      <div style={{ marginBottom: 26 }}>
        <h2
          className="h2"
          style={{
            fontSize: "30px",
            fontWeight: 950,
            letterSpacing: "-0.02em",
            color: "#493628",
            lineHeight: 1.1,
          }}
        >
          Care, Delivery & Experience
        </h2>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginTop: 10,
            padding: "7px 14px",
            borderRadius: 999,
            background:
              "linear-gradient(180deg, rgba(214, 192, 179, 0.62), rgba(214, 192, 179, 0.38))",
            border: "1px solid rgba(171, 136, 109, 0.22)",
            color: "#493628",
            fontSize: 13,
            fontWeight: 800,
            boxShadow: "0 10px 24px rgba(73, 54, 40, 0.08)",
          }}
        >
          <span style={{ opacity: 0.9 }}>✦</span>
          Anti-tarnish friendly · Boutique finish
        </span>
      </div>

      {/* PREMIUM GRID WRAP */}
      <div
        style={{
          borderRadius: 26,
          padding: "clamp(14px, 2vw, 18px)",
          background:
            "radial-gradient(120% 90% at 20% 0%, rgba(214, 192, 179, 0.22) 0%, rgba(255,255,255,1) 55%)",
          border: "1px solid rgba(171, 136, 109, 0.18)",
          boxShadow: "0 22px 60px rgba(73, 54, 40, 0.10)",
        }}
      >
        {/* INFO CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {items.map((x, i) => (
            <div
              key={x.t}
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 22,
                padding: "20px 18px",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.92) 100%)",
                border: "1px solid rgba(171, 136, 109, 0.22)",
                boxShadow: "0 12px 34px rgba(73, 54, 40, 0.10)",
                transition: "transform 0.35s ease, box-shadow 0.35s ease",
                animation: `fadeUp 0.6s ease ${i * 0.10}s both`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow =
                  "0 22px 52px rgba(73, 54, 40, 0.16)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 12px 34px rgba(73, 54, 40, 0.10)";
              }}
            >
              {/* subtle shine line */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  background:
                    "linear-gradient(120deg, transparent 0%, rgba(214, 192, 179, 0.18) 45%, transparent 70%)",
                  transform: "translateX(-35%)",
                  opacity: 0.7,
                }}
              />

              {/* ICON */}
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 16,
                  background:
                    "linear-gradient(180deg, rgba(214, 192, 179, 0.70), rgba(214, 192, 179, 0.40))",
                  border: "1px solid rgba(171, 136, 109, 0.18)",
                  color: "#493628",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 18,
                  fontWeight: 950,
                  marginBottom: 14,
                  boxShadow: "0 12px 26px rgba(73, 54, 40, 0.10)",
                }}
              >
                ✦
              </div>

              <div
                style={{
                  fontWeight: 950,
                  fontSize: 16,
                  marginBottom: 6,
                  color: "#493628",
                  letterSpacing: "-0.01em",
                }}
              >
                {x.t}
              </div>

              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "rgba(73, 54, 40, 0.74)",
                }}
              >
                {x.d}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ANIMATIONS + MOBILE POLISH */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 720px) {
          #care .h2 { font-size: 28px !important; }
        }
      `}</style>
    </section>
  );
}
