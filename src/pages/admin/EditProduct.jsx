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
        if (!prod) {
          setP(null);
          setMsg("Product not found or you don't have permission.");
        } else {
          setP(prod);
        }
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setMsg(e?.message || "Failed to load product");
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

    // validations
    if (!p.title?.trim()) return setMsg("Enter product title.");
    if (!p.categoryId) return setMsg("Select category.");
    if (!Number.isFinite(Number(p.price)) || Number(p.price) <= 0)
      return setMsg("Enter a valid price.");

    const files = [img1, img2].filter(Boolean);
    if (files.length > 2) return setMsg("Max 2 images allowed.");

    // file size check
    const MAX_MB = 8;
    const tooBig = files.find((f) => f.size > MAX_MB * 1024 * 1024);
    if (tooBig)
      return setMsg(
        `Image "${tooBig.name}" is too large. Max ${MAX_MB}MB allowed.`
      );

    setSaving(true);
    try {
      // upload new images in parallel (if any)
      let urls = [...existingImages].slice(0, 2);

      if (files.length) {
        setMsg(
          `Uploading ${files.length} image${files.length > 1 ? "s" : ""}...`
        );

        const newUrls = await Promise.all(
          files.map((f, idx) =>
            uploadToCloudinary(f, "begorgeous/products").catch((err) => {
              throw new Error(
                `Image ${idx + 1} upload failed: ${err?.message || err}`
              );
            })
          )
        );

        // Fill remaining slots up to 2
        for (const u of newUrls) {
          if (urls.length < 2) urls.push(u);
        }
      }

      setMsg("Updating product...");

      // ✅ clean payload only
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

      // clear selected local files
      setImg1(null);
      setImg2(null);
      if (file1Ref.current) file1Ref.current.value = "";
      if (file2Ref.current) file2Ref.current.value = "";

      // update UI with latest values
      setP((prev) => ({ ...prev, ...payload }));

      setMsg("Product updated ✅");

      // ✅ redirect AFTER success (back to products list)
      setTimeout(() => {
        nav("/admin/products"); // or use nav(-1)
      }, 800);
    } catch (e) {
      console.error(e);
      setMsg(`Error: ${e?.message || "Failed to update product"}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h2 className="h2">Edit Product</h2>
      <p className="p">{p.title}</p>

      <div className="adminFormCard">
        <div className="formGrid2">
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

          <input
            className="input"
            value={p.title}
            onChange={(e) => setP({ ...p, title: e.target.value })}
            disabled={saving}
          />

          <input
            className="input"
            value={p.price}
            onChange={(e) => setP({ ...p, price: e.target.value })}
            disabled={saving}
          />

          <input
            className="input"
            value={p.size || ""}
            onChange={(e) => setP({ ...p, size: e.target.value })}
            disabled={saving}
          />

          <textarea
            className="input"
            rows={4}
            value={p.description || ""}
            onChange={(e) => setP({ ...p, description: e.target.value })}
            disabled={saving}
          />

          <textarea
            className="input"
            rows={4}
            value={p.care || ""}
            onChange={(e) => setP({ ...p, care: e.target.value })}
            disabled={saving}
          />

          {/* current images */}
          <div className="fileRow" style={{ gap: 12 }}>
            {(existingImages?.length ? existingImages : ["/sample.png"]).map(
              (u, i) => (
                <img
                  key={u + i}
                  src={u}
                  alt={`Product ${i + 1}`}
                  className="miniImg"
                  loading="lazy"
                  style={{
                    width: 64,
                    height: 64,
                    objectFit: "cover",
                    borderRadius: 12,
                  }}
                />
              )
            )}
          </div>

          <div className="fileRow">
            <label className="fileBox">
              <div className="muted">Replace / Add Image 1</div>
              <input
                ref={file1Ref}
                type="file"
                accept="image/*"
                onChange={(e) => setImg1(e.target.files?.[0] || null)}
                disabled={saving}
              />
            </label>

            <label className="fileBox">
              <div className="muted">Replace / Add Image 2</div>
              <input
                ref={file2Ref}
                type="file"
                accept="image/*"
                onChange={(e) => setImg2(e.target.files?.[0] || null)}
                disabled={saving}
              />
            </label>
          </div>

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
