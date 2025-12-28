import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { uploadToCloudinary } from "../../app/cloudinary/upload";
import { listCategories } from "../../services/categories.service";
import { getProductById, updateProduct } from "../../services/products.service";

export default function EditProduct() {
  const nav = useNavigate();
  const { productId } = useParams();

  const [cats, setCats] = useState([]);
  const [p, setP] = useState(null);

  const [img1, setImg1] = useState(null);
  const [img2, setImg2] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const c = await listCategories();
      setCats(c);
      const prod = await getProductById(productId);
      setP(prod);
    })();
  }, [productId]);

  if (!p) return <div className="muted">Loading...</div>;

  async function save() {
    setMsg("");
    try {
      const files = [img1, img2].filter(Boolean);
      if (files.length > 2) return setMsg("Max 2 images allowed.");

      const urls = Array.isArray(p.images) ? [...p.images] : [];

      for (const f of files) {
        const url = await uploadToCloudinary(f, "begorgeous/products");
        if (urls.length < 2) urls.push(url);
      }

      await updateProduct(productId, { ...p, images: urls });
      nav("/admin/products");
    } catch (e) {
      console.error(e);
      setMsg(`Error: ${e?.message || "Failed to update product"}`);
    }
  }

  return (
    <div>
      <h2 className="h2">Edit Product</h2>
      <p className="p">{p.title}</p>

      <div className="adminFormCard">
        <div className="formGrid2">
          <select className="input" value={p.categoryId} onChange={(e)=>setP({ ...p, categoryId: e.target.value })}>
            {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <input className="input" value={p.title} onChange={(e)=>setP({ ...p, title: e.target.value })} />
          <input className="input" value={p.price} onChange={(e)=>setP({ ...p, price: Number(e.target.value || 0) })} />
          <input className="input" value={p.size || ""} onChange={(e)=>setP({ ...p, size: e.target.value })} />

          <textarea className="input" rows={4} value={p.description || ""} onChange={(e)=>setP({ ...p, description: e.target.value })} />
          <textarea className="input" rows={4} value={p.care || ""} onChange={(e)=>setP({ ...p, care: e.target.value })} />

          <div className="fileRow">
            <label className="fileBox">
              <div className="muted">Add Image 1</div>
              <input type="file" accept="image/*" onChange={(e)=>setImg1(e.target.files?.[0] || null)} />
            </label>
            <label className="fileBox">
              <div className="muted">Add Image 2</div>
              <input type="file" accept="image/*" onChange={(e)=>setImg2(e.target.files?.[0] || null)} />
            </label>
          </div>

          <label className="checkRow">
            <input type="checkbox" checked={!!p.featured} onChange={(e)=>setP({ ...p, featured: e.target.checked })} />
            <span>Featured</span>
          </label>

          <button className="btn primary" onClick={save}>Update</button>
        </div>

        {msg && <div className="muted" style={{ marginTop: 10 }}>{msg}</div>}
      </div>
    </div>
  );
}
