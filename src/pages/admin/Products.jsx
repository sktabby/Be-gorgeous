import React, { useEffect, useState } from "react";
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

  useEffect(() => { refresh(); }, []);

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

  return (
    <div>
      <div className="adminHeadRow">
        <div>
          <h2 className="h2">Products</h2>
          <p className="p">All listings.</p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn ghost" onClick={refresh}>Refresh</button>
          <button className="btn primary" onClick={() => nav(ROUTES.ADMIN_ADD_PRODUCT)}>
            + Add Product
          </button>
        </div>
      </div>

      {msg && <div className="err" style={{ marginTop: 12 }}>{msg}</div>}

      <div className="adminList">
        {items.map((p) => (
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
              <button className="btn ghost" onClick={() => del(p.id, p.title)} disabled={busy}>
                Delete
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="emptyHint">No products yet.</div>
        )}
      </div>
    </div>
  );
}
