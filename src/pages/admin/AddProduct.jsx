import React, { useEffect, useRef, useState } from "react";
import { uploadToCloudinary } from "../../app/cloudinary/upload";
import { listCategories } from "../../services/categories.service";
import { createProduct } from "../../services/products.service";

export default function AddProduct() {
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

    // clear file input UI text
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
        createdAt: Date.now(), // remove if your backend sets timestamps
      });

      console.timeEnd("CREATE_PRODUCT");

      // ✅ Stay on same page + clear fields
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

        <button className="btn ghost" onClick={loadCats} disabled={catsLoading}>
          {catsLoading ? "Refreshing..." : "Refresh Categories"}
        </button>
      </div>

      <div className="adminFormCard">
        <div className="formGrid2">
          <select
            className="input"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={catsLoading || !cats.length}
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

          <input
            className="input"
            placeholder="Product title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="input"
            placeholder="Price (e.g., 2499)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            className="input"
            placeholder="Size (e.g., 6 / Adjustable)"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />

          <textarea
            className="input"
            rows={4}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <textarea
            className="input"
            rows={4}
            placeholder="Care"
            value={care}
            onChange={(e) => setCare(e.target.value)}
          />

          <div className="fileRow">
            <label className="fileBox">
              <div className="muted">Image 1</div>
              <input
                ref={file1Ref}
                type="file"
                accept="image/*"
                onChange={(e) => setImg1(e.target.files?.[0] || null)}
              />
            </label>

            <label className="fileBox">
              <div className="muted">Image 2</div>
              <input
                ref={file2Ref}
                type="file"
                accept="image/*"
                onChange={(e) => setImg2(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <label className="checkRow">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            <span>Mark as featured</span>
          </label>

          <button
            className="btn primary"
            onClick={save}
            disabled={saving || catsLoading || !cats.length}
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
