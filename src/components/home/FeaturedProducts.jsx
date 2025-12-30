import React from "react";
import ProductCard from "../products/ProductCard";

export default function FeaturedProducts({ featured = [], onGoCart }) {
  // ✅ safety: if featured accidentally comes as null/undefined/not-array
  const safeFeatured = Array.isArray(featured) ? featured : [];

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
          Featured
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
          Handpicked premium pieces
        </span>
      </div>

      {/* ACTION */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button
          className="btn ghost"
          onClick={onGoCart || (() => {})}
          disabled={!onGoCart}
          title={!onGoCart ? "Cart action not connected yet" : "Go to cart"}
        >
          Go to cart
        </button>
      </div>

      {/* PRODUCTS */}
      <div className="grid3">
        {safeFeatured.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}

        {safeFeatured.length === 0 && (
          <div
            className="emptyHint"
            style={{
              gridColumn: "1 / -1",
              padding: "18px 16px",
              borderRadius: 16,
              border: "1px dashed rgba(73, 54, 40, 0.28)",
              background: "rgba(214, 192, 179, 0.18)",
              color: "#493628",
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: 6 }}>No featured products yet</div>
            <div className="muted" style={{ color: "rgba(73, 54, 40, 0.75)" }}>
              Add some from <b>Admin → Products</b> (set <b>featured: true</b>), or use the fallback
              logic in <b>listFeatured()</b> to show latest products automatically.
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
