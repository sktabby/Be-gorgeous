import React from "react";
import ProductCard from "../products/ProductCard";

export default function FeaturedProducts({ featured, onGoCart }) {
  return (
    <section
      className="container section"
      id="featured"
      style={{
        margin: "clamp(10px, 2vw, 60px) auto",
        paddingLeft: "clamp(12px, 4vw, 0px)",
        paddingRight: "clamp(12px, 4vw, 0px)",
      }}
    >
      {/* HEADER — SAME PATTERN AS COLLECTIONS */}
      <div style={{ marginBottom: 20 }}>
        <h2
          className="h2"
          style={{
            fontSize: "30px",
            fontWeight: 900,
            letterSpacing: "-0.015em",
            color: "#1c1c1c",
          }}
        >
          Featured
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
          Handpicked premium pieces
        </span>
      </div>

      {/* ACTION */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button className="btn ghost" onClick={onGoCart}>
          Go to cart
        </button>
      </div>

      {/* PRODUCTS */}
      <div className="grid3">
        {featured.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}

        {featured.length === 0 && (
          <div className="emptyHint">
            No featured products yet. Add from <b>Admin → Products</b>.
          </div>
        )}
      </div>
    </section>
  );
}
