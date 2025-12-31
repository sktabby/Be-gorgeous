import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { listByCategory } from "../../services/products.service";
import { listCategories } from "../../services/categories.service";
import ProductCard from "../../components/products/ProductCard";

export default function Category() {
  const { categoryId } = useParams();
  const nav = useNavigate();

  const [items, setItems] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  // ✅ search state
  const [q, setQ] = useState("");

  const catName = useMemo(() => {
    const found = cats.find((c) => c.id === categoryId);
    return found?.name || categoryId;
  }, [cats, categoryId]);

  // ✅ filter items by title/name (whatever exists)
  const filteredItems = useMemo(() => {
    const queryText = (q || "").trim().toLowerCase();
    if (!queryText) return items;

    return (Array.isArray(items) ? items : []).filter((p) => {
      const title = String(p?.title ?? p?.name ?? "").toLowerCase();
      return title.includes(queryText);
    });
  }, [items, q]);

  async function load() {
    setMsg("");
    setLoading(true);

    try {
      // Load category list too (so we can show name instead of id)
      const [prods, categories] = await Promise.all([
        listByCategory(categoryId),
        listCategories(200),
      ]);

      setItems(Array.isArray(prods) ? prods : []);
      setCats(Array.isArray(categories) ? categories : []);
    } catch (e) {
      console.error(e);

      const message = e?.message || "Failed to load products";

      // Helpful hint for the common Firestore index case
      if (message.toLowerCase().includes("requires an index")) {
        setMsg(
          "Firestore needs an index for this category query. Open the console error link and create the index, then refresh."
        );
      } else {
        setMsg(message);
      }

      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  // ✅ tiny inline SVG icons (theme-friendly)
  const SearchIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16.2 16.2 21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

  const XIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M18 6 6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <div className="container section">
      {/* ✅ mobile padding polish + grid 2-per-row on phones + search styling */}
      <style>{`
        @media (max-width: 720px) {
          .container.section{
            padding-left: 12px !important;
            padding-right: 12px !important;
          }
          .container.section .pageHead{
            gap: 12px !important;
          }
          .container.section .grid3{
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important; /* ✅ 2 per row */
            gap: 10px !important;
          }
        }
        @media (max-width: 380px) {
          .container.section .grid3{
            grid-template-columns: 1fr !important; /* super small screens */
          }
        }
      `}</style>

      <div className="pageHead">
        <div>
          <h2 className="h2">Collection</h2>
          <p className="p">{catName}</p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {/* ✅ removed Refresh button */}
          <button className="btn ghost" onClick={() => nav(-1)}>
            Back
          </button>
        </div>
      </div>

      {/* ✅ STYLISH THEME SEARCH BAR */}
      <div style={{ marginTop: 14 }}>
        <div
          style={{
            position: "relative",
            borderRadius: 18,
            padding: 2,
            background:
              "linear-gradient(135deg, rgba(171, 136, 109, 0.35), rgba(214, 192, 179, 0.22))",
            boxShadow: "0 18px 44px rgba(73, 54, 40, 0.10)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 14px",
              borderRadius: 16,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.92))",
              border: "1px solid rgba(171, 136, 109, 0.18)",
              backdropFilter: "blur(10px)",
            }}
          >
            <span style={{ color: "#493628", opacity: 0.85, display: "grid", placeItems: "center" }}>
              {SearchIcon}
            </span>

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by product title..."
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
                color: "#493628",
                fontWeight: 800,
                fontSize: 14,
                letterSpacing: "-0.01em",
              }}
            />

            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                aria-label="Clear search"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 12,
                  border: "1px solid rgba(171, 136, 109, 0.22)",
                  background: "rgba(214, 192, 179, 0.38)",
                  color: "#493628",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                  boxShadow: "0 10px 24px rgba(73, 54, 40, 0.08)",
                }}
              >
                {XIcon}
              </button>
            )}
          </div>
        </div>

        {!loading && (q || "").trim() && (
          <div
            className="muted"
            style={{ marginTop: 8, color: "rgba(73, 54, 40, 0.70)", fontWeight: 700 }}
          >
            Showing {filteredItems.length} of {items.length}
          </div>
        )}
      </div>

      {msg && (
        <div className="err" style={{ marginTop: 12 }}>
          {msg}
        </div>
      )}

      {loading && !msg && (
        <div className="emptyHint" style={{ marginTop: 12 }}>
          Loading products…
        </div>
      )}

      <div className="grid3" style={{ marginTop: 16 }}>
        {!loading && filteredItems.map((p) => <ProductCard key={p.id} p={p} />)}

        {!loading && filteredItems.length === 0 && !msg && (
          <div className="emptyHint">
            {(q || "").trim() ? "No matching products found." : "No products in this collection yet."}
          </div>
        )}
      </div>
    </div>
  );
}
