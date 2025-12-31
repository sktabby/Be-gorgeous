import React, { useEffect, useMemo, useRef, useState } from "react";
import { uploadToCloudinary } from "../../app/cloudinary/upload";
import { listCategories } from "../../services/categories.service";
import { createProduct } from "../../services/products.service";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../app/routes";

export default function AddProduct() {
  const nav = useNavigate();
  const file1Ref = useRef(null);
  const file2Ref = useRef(null);

  const [cats, setCats] = useState([]);
  const [catsLoading, setCatsLoading] = useState(true);

  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [care, setCare] = useState("");
  const [featured, setFeatured] = useState(false);

  const [img1, setImg1] = useState(null);
  const [img2, setImg2] = useState(null);

  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setTitle("");
    setDescription("");
    setPrice("");
    setSize("");
    setCare("");
    setFeatured(false);
    setImg1(null);
    setImg2(null);

    if (file1Ref.current) file1Ref.current.value = "";
    if (file2Ref.current) file2Ref.current.value = "";
  }

  async function loadCats() {
    setCatsLoading(true);
    try {
      const c = await listCategories();
      setCats(c || []);
      if (c?.[0]?.id && !categoryId) setCategoryId(c[0].id);
      if (!c?.length) setMsg("No categories found. Create one first.");
    } catch (e) {
      console.error(e);
      setMsg(`Failed to load categories: ${e?.message || "Unknown error"}`);
    } finally {
      setCatsLoading(false);
    }
  }

  useEffect(() => {
    loadCats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedCatName = useMemo(() => {
    return cats.find((c) => c.id === categoryId)?.name || "Select category";
  }, [cats, categoryId]);

  async function save() {
    setMsg("");

    if (!title.trim()) return setMsg("Enter product title.");
    if (!categoryId) return setMsg("Select category.");
    if (!price) return setMsg("Enter price.");

    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      return setMsg("Enter a valid price.");
    }

    const files = [img1, img2].filter(Boolean);
    if (!files.length) return setMsg("Please select at least 1 image.");
    if (files.length > 2) return setMsg("Max 2 images allowed.");

    const MAX_MB = 8;
    const tooBig = files.find((f) => f.size > MAX_MB * 1024 * 1024);
    if (tooBig) return setMsg(`Image "${tooBig.name}" is too large. Max ${MAX_MB}MB allowed.`);

    setSaving(true);
    console.time("TOTAL_SAVE");

    try {
      setMsg(`Uploading ${files.length} image${files.length > 1 ? "s" : ""}...`);
      console.time("UPLOAD_IMAGES");

      const urls = await Promise.all(
        files.map((f, idx) =>
          uploadToCloudinary(f, "begorgeous/products").catch((err) => {
            throw new Error(`Image ${idx + 1} upload failed: ${err?.message || err}`);
          })
        )
      );

      console.timeEnd("UPLOAD_IMAGES");

      setMsg("Creating product...");
      console.time("CREATE_PRODUCT");

      await createProduct({
        categoryId,
        title: title.trim(),
        description: description.trim(),
        price: priceNum,
        size: size.trim(),
        care: care.trim(),
        images: urls,
        featured,
        createdAt: Date.now(),
      });

      console.timeEnd("CREATE_PRODUCT");

      resetForm();
      setMsg("Product added ✅ You can add another one.");
    } catch (e) {
      console.error(e);
      setMsg(`Error: ${e?.message || "Failed to add product"}`);
    } finally {
      console.timeEnd("TOTAL_SAVE");
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="adminHeadRow">
        <div>
          <h2 className="h2">Add Product</h2>
          <p className="p">Add complete details.</p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {/* ✅ Back button BEFORE refresh */}
          <button
            className="btn ghost"
            onClick={() => nav(ROUTES.ADMIN_PRODUCTS)}
            type="button"
            style={{ borderRadius: 999, padding: "10px 14px", whiteSpace: "nowrap" }}
          >
            Back
          </button>

          <button className="btn ghost" onClick={loadCats} disabled={catsLoading}>
            {catsLoading ? "Refreshing..." : "Refresh Categories"}
          </button>
        </div>
      </div>

      <div
        className="adminFormCard"
        style={{
          borderRadius: 22,
          border: "1px solid rgba(171, 136, 109, 0.22)",
          background:
            "radial-gradient(120% 90% at 20% 0%, rgba(214, 192, 179, 0.22) 0%, rgba(255,255,255,1) 55%)",
          boxShadow: "0 22px 60px rgba(73, 54, 40, 0.10)",
          padding: 16,
        }}
      >
        <div className="formGrid2">
          {/* ✅ Styled dropdown (same select) */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                fontWeight: 900,
                color: "#493628",
                fontSize: 13,
                marginBottom: 8,
                letterSpacing: "-0.01em",
              }}
            >
              Category
            </div>

            <select
              className="input"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={catsLoading || !cats.length}
              style={{
                borderRadius: 16,
                border: "1px solid rgba(171, 136, 109, 0.22)",
                background: "rgba(255,255,255,0.85)",
                boxShadow: "0 12px 26px rgba(73, 54, 40, 0.08)",
                appearance: "none",
                paddingRight: 42,
                fontWeight: 900,
                color: "#493628",
              }}
            >
              {cats.length ? (
                cats.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))
              ) : (
                <option value="">No categories</option>
              )}
            </select>

            {/* chevron */}
            <div
              style={{
                position: "absolute",
                right: 12,
                top: 42,
                pointerEvents: "none",
                color: "rgba(73,54,40,0.70)",
              }}
              title={selectedCatName}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 900, color: "#493628", fontSize: 13, marginBottom: 8 }}>
              Product title
            </div>
            <input
              className="input"
              placeholder="Product title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                borderRadius: 16,
                border: "1px solid rgba(171, 136, 109, 0.22)",
                background: "rgba(255,255,255,0.85)",
                boxShadow: "0 12px 26px rgba(73, 54, 40, 0.08)",
              }}
            />
          </div>

          <div>
            <div style={{ fontWeight: 900, color: "#493628", fontSize: 13, marginBottom: 8 }}>
              Price
            </div>
            <input
              className="input"
              placeholder="Price (e.g., 2499)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{
                borderRadius: 16,
                border: "1px solid rgba(171, 136, 109, 0.22)",
                background: "rgba(255,255,255,0.85)",
                boxShadow: "0 12px 26px rgba(73, 54, 40, 0.08)",
              }}
            />
          </div>

          <div>
            <div style={{ fontWeight: 900, color: "#493628", fontSize: 13, marginBottom: 8 }}>
              Size
            </div>
            <input
              className="input"
              placeholder="Size (e.g., 6 / Adjustable)"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              style={{
                borderRadius: 16,
                border: "1px solid rgba(171, 136, 109, 0.22)",
                background: "rgba(255,255,255,0.85)",
                boxShadow: "0 12px 26px rgba(73, 54, 40, 0.08)",
              }}
            />
          </div>

          <div>
            <div style={{ fontWeight: 900, color: "#493628", fontSize: 13, marginBottom: 8 }}>
              Description
            </div>
            <textarea
              className="input"
              rows={4}
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                borderRadius: 16,
                border: "1px solid rgba(171, 136, 109, 0.22)",
                background: "rgba(255,255,255,0.85)",
                boxShadow: "0 12px 26px rgba(73, 54, 40, 0.08)",
              }}
            />
          </div>

          <div>
            <div style={{ fontWeight: 900, color: "#493628", fontSize: 13, marginBottom: 8 }}>
              Care
            </div>
            <textarea
              className="input"
              rows={4}
              placeholder="Care"
              value={care}
              onChange={(e) => setCare(e.target.value)}
              style={{
                borderRadius: 16,
                border: "1px solid rgba(171, 136, 109, 0.22)",
                background: "rgba(255,255,255,0.85)",
                boxShadow: "0 12px 26px rgba(73, 54, 40, 0.08)",
              }}
            />
          </div>

          <div className="fileRow">
            <label
              className="fileBox"
              style={{
                borderRadius: 18,
                border: "1px dashed rgba(171, 136, 109, 0.45)",
                background: "rgba(214, 192, 179, 0.14)",
                padding: 12,
              }}
            >
              <div className="muted" style={{ fontWeight: 800, color: "rgba(73,54,40,0.72)" }}>
                Image 1
              </div>
              <input
                ref={file1Ref}
                type="file"
                accept="image/*"
                onChange={(e) => setImg1(e.target.files?.[0] || null)}
              />
            </label>

            <label
              className="fileBox"
              style={{
                borderRadius: 18,
                border: "1px dashed rgba(171, 136, 109, 0.45)",
                background: "rgba(214, 192, 179, 0.14)",
                padding: 12,
              }}
            >
              <div className="muted" style={{ fontWeight: 800, color: "rgba(73,54,40,0.72)" }}>
                Image 2
              </div>
              <input
                ref={file2Ref}
                type="file"
                accept="image/*"
                onChange={(e) => setImg2(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <label className="checkRow" style={{ padding: "10px 10px", borderRadius: 16, background: "rgba(214,192,179,0.14)" }}>
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            <span style={{ fontWeight: 800, color: "#493628" }}>Mark as featured</span>
          </label>

          <button
            className="btn primary"
            onClick={save}
            disabled={saving || catsLoading || !cats.length}
            style={{
              borderRadius: 999,
              padding: "12px 14px",
              fontWeight: 900,
              boxShadow: "0 16px 34px rgba(73, 54, 40, 0.18)",
            }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

        {msg && (
          <div className="err" style={{ marginTop: 10 }}>
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}
