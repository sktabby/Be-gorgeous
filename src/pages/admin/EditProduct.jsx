import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { uploadToCloudinary } from "../../app/cloudinary/upload";
import { listCategories } from "../../services/categories.service";
import { getProductById, updateProduct } from "../../services/products.service";

export default function EditProduct() {
  const nav = useNavigate();
  const { productId } = useParams();

  const file1Ref = useRef(null);
  const file2Ref = useRef(null);

  const [cats, setCats] = useState([]);
  const [p, setP] = useState(null);

  const [img1, setImg1] = useState(null);
  const [img2, setImg2] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const existingImages = useMemo(
    () => (Array.isArray(p?.images) ? p.images : []),
    [p]
  );

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setMsg("");
      try {
        const [c, prod] = await Promise.all([
          listCategories(),
          getProductById(productId),
        ]);

        if (!alive) return;

        setCats(Array.isArray(c) ? c : []);
        setP(prod || null);
      } catch (e) {
        console.error(e);
        if (alive) setMsg(e?.message || "Failed to load product");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [productId]);

  if (loading) return <div className="muted">Loading…</div>;
  if (!p) return <div className="muted">{msg || "Product not found."}</div>;

  async function save() {
    setMsg("");

    if (!p.title?.trim()) return setMsg("Enter product title.");
    if (!p.categoryId) return setMsg("Select category.");
    if (!Number.isFinite(Number(p.price)) || Number(p.price) <= 0)
      return setMsg("Enter a valid price.");

    setSaving(true);
    try {
      let urls = [...existingImages].slice(0, 2);

      const files = [img1, img2].filter(Boolean);
      if (files.length) {
        const newUrls = await Promise.all(
          files.map((f) => uploadToCloudinary(f, "begorgeous/products"))
        );
        for (const u of newUrls) if (urls.length < 2) urls.push(u);
      }

      const payload = {
        categoryId: p.categoryId,
        title: p.title.trim(),
        description: (p.description || "").trim(),
        price: Number(p.price),
        size: (p.size || "").trim(),
        care: (p.care || "").trim(),
        featured: !!p.featured,
        images: urls,
        updatedAtMs: Date.now(),
      };

      await updateProduct(productId, payload);
      setP((prev) => ({ ...prev, ...payload }));
      setMsg("Product updated ✅");

      setTimeout(() => nav("/admin/products"), 800);
    } catch (e) {
      console.error(e);
      setMsg(e?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {/* HEADER */}
      <div className="adminHeadRow">
        <div>
          <h2 className="h2">Edit Product</h2>
          <p className="p">{p.title}</p>
        </div>

        <button
          className="btn ghost"
          type="button"
          onClick={() => nav("/admin/products")}
          disabled={saving}
        >
          Back
        </button>
      </div>

      <div className="adminFormCard">
        <div className="formGrid2">

          {/* CATEGORY */}
          <div>
           <div style={{ fontWeight: 900, marginBottom: 6, color: "#000" }}>
              Category
            </div>
            <select
              className="input"
              value={p.categoryId}
              onChange={(e) => setP({ ...p, categoryId: e.target.value })}
              disabled={saving}
            >
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* TITLE */}
          <div>
          <div style={{ fontWeight: 900, marginBottom: 6, color: "#000" }}>
              Product title
            </div>
            <input
              className="input"
              value={p.title}
              onChange={(e) => setP({ ...p, title: e.target.value })}
              disabled={saving}
            />
          </div>

          {/* PRICE */}
          <div>
            <div style={{ fontWeight: 900, marginBottom: 6, color: "#000" }}>
              Price
            </div>
            <input
              className="input"
              value={p.price}
              onChange={(e) => setP({ ...p, price: e.target.value })}
              disabled={saving}
            />
          </div>

          {/* SIZE */}
          <div>
           <div style={{ fontWeight: 900, marginBottom: 6, color: "#000" }}>
              Size
            </div>
            <input
              className="input"
              value={p.size || ""}
              onChange={(e) => setP({ ...p, size: e.target.value })}
              disabled={saving}
            />
          </div>

          {/* DESCRIPTION */}
          <div>
           <div style={{ fontWeight: 900, marginBottom: 6, color: "#000" }}>
              Description
            </div>
            <textarea
              className="input"
              rows={4}
              value={p.description || ""}
              onChange={(e) => setP({ ...p, description: e.target.value })}
              disabled={saving}
            />
          </div>

          {/* CARE */}
          <div>
           <div style={{ fontWeight: 900, marginBottom: 6, color: "#000" }}>
              Care instructions
            </div>
            <textarea
              className="input"
              rows={4}
              value={p.care || ""}
              onChange={(e) => setP({ ...p, care: e.target.value })}
              disabled={saving}
            />
          </div>

          {/* FEATURED */}
          <label className="checkRow">
            <input
              type="checkbox"
              checked={!!p.featured}
              onChange={(e) => setP({ ...p, featured: e.target.checked })}
              disabled={saving}
            />
            <span>Featured</span>
          </label>

          <button className="btn primary" onClick={save} disabled={saving}>
            {saving ? "Updating..." : "Update"}
          </button>
        </div>

        {msg && (
          <div className="muted" style={{ marginTop: 10 }}>
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}
