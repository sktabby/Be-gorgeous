import React from "react";

const items = [
  {
    t: "Care",
    d: "Avoid water & perfume. Store in a dry box to maintain long-lasting shine.",
  },
  {
    t: "Delivery",
    d: "Quick dispatch with secure, gift-ready packaging for every order.",
  },
  {
    t: "Ordering",
    d: "Add to cart → checkout → send your order with one simple tap.",
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
      {/* HEADER — CONSISTENT WITH COLLECTIONS / FEATURED */}
      <div style={{ marginBottom: 26 }}>
        <h2
          className="h2"
          style={{
            fontSize: "30px",
            fontWeight: 900,
            letterSpacing: "-0.015em",
            color: "#1c1c1c",
          }}
        >
          Care & Delivery
        </h2>

        <span
          style={{
            display: "inline-block",
            marginTop: 10,
            padding: "6px 14px",
            borderRadius: 999,
            background: "rgba(255,79,163,0.12)",
            color: "#ff4fa3",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          Simple policies · Premium experience
        </span>
      </div>

      {/* INFO CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 18,
        }}
      >
        {items.map((x, i) => (
          <div
            key={x.t}
            style={{
              borderRadius: 20,
              padding: "20px 18px",
              background: "#fff",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
              transition:
                "transform 0.35s ease, box-shadow 0.35s ease",
              animation: `fadeUp 0.6s ease ${i * 0.12}s both`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow =
                "0 18px 45px rgba(255,79,163,0.18)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 10px 30px rgba(0,0,0,0.06)";
            }}
          >
            {/* ICON */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(255,79,163,0.14)",
                color: "#ff4fa3",
                display: "grid",
                placeItems: "center",
                fontSize: 18,
                fontWeight: 900,
                marginBottom: 14,
              }}
            >
              ✦
            </div>

            <div
              style={{
                fontWeight: 900,
                fontSize: 16,
                marginBottom: 6,
              }}
            >
              {x.t}
            </div>

            <div
              style={{
                fontSize: 14,
                lineHeight: 1.65,
                color: "#6f6f6f",
              }}
            >
              {x.d}
            </div>
          </div>
        ))}
      </div>

      {/* ANIMATIONS */}
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
