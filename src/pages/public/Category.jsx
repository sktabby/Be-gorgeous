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

  const catName = useMemo(() => {
    const found = cats.find((c) => c.id === categoryId);
    return found?.name || categoryId;
  }, [cats, categoryId]);

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

  return (
    <div className="container section">
      <div className="pageHead">
        <div>
          <h2 className="h2">Collection</h2>
          <p className="p">{catName}</p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn ghost" onClick={load} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </button>
          <button className="btn ghost" onClick={() => nav(-1)}>
            Back
          </button>
        </div>
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
        {!loading &&
          items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}

        {!loading && items.length === 0 && !msg && (
          <div className="emptyHint">No products in this collection yet.</div>
        )}
      </div>
    </div>
  );
}
