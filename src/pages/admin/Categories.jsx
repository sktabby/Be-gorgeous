import React, { useEffect, useState } from "react";
import { uploadToCloudinary } from "../../app/cloudinary/upload";
import { createCategory, listCategories, removeCategory } from "../../services/categories.service";

export default function Categories() {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);

  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    try {
      const res = await listCategories();
      setItems(res);
    } catch (e) {
      console.error(e);
      setMsg(`Failed to load categories: ${e?.message || "Unknown error"}`);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function add() {
    setMsg("");
    try {
      if (!name.trim()) return setMsg("Enter category name.");

      setBusy(true);

      let imageUrl = "";
      if (file) {
        imageUrl = await uploadToCloudinary(file, "begorgeous/categories");
      }

      await createCategory({ name: name.trim(), note: note.trim(), imageUrl });

      setName("");
      setNote("");
      setFile(null);

      await refresh();
      setMsg("Category added ✅");
    } catch (e) {
      console.error(e);
      setMsg(`Error: ${e?.message || "Failed to add category"}`);
    } finally {
      setBusy(false);
    }
  }

  async function del(id, catName) {
    setMsg("");
    const ok = window.confirm(`Delete category "${catName}"?`);
    if (!ok) return;

    try {
      setBusy(true);
      await removeCategory(id);
      await refresh();
      setMsg("Category deleted ✅");
    } catch (e) {
      console.error(e);
      setMsg(e?.message || "Failed to delete category");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="adminHeadRow">
        <div>
          <h2 className="h2">Categories</h2>
          <p className="p">Create collections.</p>
        </div>
        <button className="btn ghost" onClick={refresh}>Refresh</button>
      </div>

      <div className="adminFormCard">
        <div className="formGrid">
          <input className="input" placeholder="Category name (e.g., Rings)" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" placeholder="Short note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
          <input className="input" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <button className="btn primary" onClick={add} disabled={busy}>
            {busy ? "Saving..." : "Add Category"}
          </button>
        </div>

        {msg && <div className="err" style={{ marginTop: 10 }}>{msg}</div>}
      </div>

      <div className="adminList">
        {items.map((c) => (
          <div key={c.id} className="adminRow">
            <div className="adminRowLeft">
              <img className="miniImg" src={c.imageUrl || "/sample.png"} alt={c.name} />
              <div>
                <div className="strong">{c.name}</div>
                <div className="muted">{c.note || "—"}</div>
              </div>
            </div>

            <div className="adminRowActions">
              <button className="btn ghost" onClick={() => del(c.id, c.name)} disabled={busy}>
                Delete
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="emptyHint">No categories yet.</div>
        )}
      </div>
    </div>
  );
}
