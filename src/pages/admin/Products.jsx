import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../app/routes";
import { listProducts, removeProduct } from "../../services/products.service";
import { listCategories } from "../../services/categories.service";

export default function Products() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [catMap, setCatMap] = useState({});
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  // ✅ search (UI-only)
  const [q, setQ] = useState("");

  async function refresh() {
    setMsg("");
    try {
      const [prods, cats] = await Promise.all([listProducts(), listCategories()]);
      setItems(prods);
      setCatMap(Object.fromEntries(cats.map((c) => [c.id, c.name])));
    } catch (e) {
      console.error(e);
      setMsg(`Failed to load products: ${e?.message || "Unknown error"}`);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const filteredItems = useMemo(() => {
    const t = (q || "").trim().toLowerCase();
    if (!t) return items;

    return items.filter((p) => {
      const title = String(p?.title || "").toLowerCase();
      const catName = String(catMap?.[p?.categoryId] || p?.categoryId || "").toLowerCase();
      const price = String(p?.price ?? "").toLowerCase();
      return title.includes(t) || catName.includes(t) || price.includes(t);
    });
  }, [items, q, catMap]);

  async function del(id, title) {
    setMsg("");
    const ok = window.confirm(`Delete product "${title}"?`);
    if (!ok) return;

    try {
      setBusy(true);
      await removeProduct(id);
      await refresh();
      setMsg("Product deleted ✅");
    } catch (e) {
      console.error(e);
      setMsg(e?.message || "Failed to delete product");
    } finally {
      setBusy(false);
    }
  }

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
    <div>
      <div className="adminHeadRow">
        <div>
          <h2 className="h2">Products</h2>
          <p className="p">All listings.</p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn ghost" onClick={refresh}>
            Refresh
          </button>
          <button className="btn primary" onClick={() => nav(ROUTES.ADMIN_ADD_PRODUCT)}>
            + Add Product
          </button>
        </div>
      </div>

      {msg && (
        <div className="err" style={{ marginTop: 12 }}>
          {msg}
        </div>
      )}

      {/* ✅ Premium container card (search + scroll list inside one card) */}
      <div
        style={{
          marginTop: 14,
          borderRadius: 22,
          border: "1px solid rgba(171, 136, 109, 0.20)",
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 22px 60px rgba(73, 54, 40, 0.10)",
          padding: 12,
        }}
      >
        {/* ✅ Search bar */}
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              position: "relative",
              borderRadius: 18,
              padding: 2,
              background:
                "linear-gradient(135deg, rgba(171, 136, 109, 0.32), rgba(214, 192, 179, 0.22))",
              boxShadow: "0 16px 38px rgba(73, 54, 40, 0.10)",
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
              }}
            >
              <span
                style={{
                  color: "#493628",
                  opacity: 0.85,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {SearchIcon}
              </span>

              <input
                className="input"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products by title, category, price..."
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "#493628",
                  fontWeight: 900,
                  fontSize: 14,
                  padding: 0,
                  boxShadow: "none",
                }}
              />

              {q && (
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => setQ("")}
                  title="Clear search"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 14,
                    padding: 0,
                    display: "grid",
                    placeItems: "center",
                    border: "1px solid rgba(171, 136, 109, 0.22)",
                    background: "rgba(214, 192, 179, 0.30)",
                    color: "#493628",
                    boxShadow: "0 10px 22px rgba(73, 54, 40, 0.08)",
                  }}
                >
                  {XIcon}
                </button>
              )}
            </div>
          </div>

          {!!(q || "").trim() && (
            <div
              className="muted"
              style={{ marginTop: 8, color: "rgba(73,54,40,0.70)", fontWeight: 700 }}
            >
              Showing {filteredItems.length} of {items.length}
            </div>
          )}
        </div>

        {/* ✅ Scroll list */}
        <div
          className="adminList"
          style={{
            maxHeight: 520,
            overflow: "auto",
            paddingRight: 6,
          }}
        >
          {filteredItems.map((p) => (
            <div key={p.id} className="adminRow">
              <div className="adminRowLeft">
                <img className="miniImg" src={p.images?.[0] || "/sample.png"} alt={p.title} />
                <div>
                  <div className="strong">{p.title}</div>
                  <div className="muted">
                    {catMap[p.categoryId] || p.categoryId} • ₹{p.price}
                  </div>
                </div>
              </div>

              <div className="adminRowActions">
                <button className="btn ghost" onClick={() => nav(`/admin/products/${p.id}/edit`)}>
                  Edit
                </button>
                <button
                  className="btn ghost"
                  onClick={() => del(p.id, p.title)}
                  disabled={busy}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="emptyHint">{items.length === 0 ? "No products yet." : "No matches found."}</div>
          )}
        </div>
      </div>

      {/* ✅ Scrollbar polish (scoped) */}
      <style>{`
        .adminList::-webkit-scrollbar{ width: 10px; }
        .adminList::-webkit-scrollbar-thumb{
          background: rgba(171, 136, 109, 0.35);
          border-radius: 999px;
          border: 3px solid rgba(255,255,255,0.55);
        }
        .adminList::-webkit-scrollbar-track{
          background: rgba(214, 192, 179, 0.10);
          border-radius: 999px;
        }
      `}</style>
    </div>
  );
}
