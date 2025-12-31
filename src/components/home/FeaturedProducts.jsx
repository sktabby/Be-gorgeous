import React, { useMemo, useState } from "react";
import ProductCard from "../products/ProductCard";

export default function FeaturedProducts({ featured = [], onGoCart }) {
  // ✅ safety: if featured accidentally comes as null/undefined/not-array
  const safeFeatured = Array.isArray(featured) ? featured : [];

  const LIMIT = 6;
  const [showAll, setShowAll] = useState(false);

  const hasMore = safeFeatured.length > LIMIT;

  const visibleFeatured = useMemo(() => {
    return showAll ? safeFeatured : safeFeatured.slice(0, LIMIT);
  }, [safeFeatured, showAll]);

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

      
     

      {/* PRODUCTS */}
      <div
        className="grid3"
        style={{
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "clamp(10px, 2vw, 18px)",
        }}
      >
        {/* ✅ mobile: a bit tighter so cards look smaller */}
       <style>{`
  @media (max-width: 720px) {
    #featured .grid3{
      grid-template-columns: 1fr !important;   /* ✅ 1 card per row */
      gap: 10px !important;
    }
    #featured .grid3 > *{
      max-width: 360px;                       /* ✅ smaller card feel */
      width: 100%;
      margin: 0 auto;                         /* ✅ centered */
    }
  }
`}</style>


        {visibleFeatured.map((p) => (
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

      {/* ✅ VIEW MORE / LESS */}
      {hasMore && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
          <button
            className="btn"
            type="button"
            onClick={() => setShowAll((v) => !v)}
            style={{
              padding: "10px 18px",
              borderRadius: 999,
              border: "1px solid rgba(73, 54, 40, 0.22)",
              background: "rgba(214, 192, 179, 0.55)",
              color: "#493628",
              fontWeight: 800,
              letterSpacing: "0.01em",
              boxShadow: "0 10px 24px rgba(73, 54, 40, 0.10)",
              cursor: "pointer",
            }}
          >
            {showAll ? "View less" : "View more"}
          </button>
        </div>
      )}
    </section>
  );
}
