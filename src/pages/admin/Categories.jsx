import React, { useEffect, useMemo, useRef, useState } from "react";
import { uploadToCloudinary } from "../../app/cloudinary/upload";
import {
  createCategory,
  listCategories,
  removeCategory,
} from "../../services/categories.service";

const CATS_CACHE_KEY = "bg_categories_cache";

export default function Categories() {
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);

  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState("");

  const [refreshing, setRefreshing] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const sortedItems = useMemo(() => {
    // Keep newest first even if backend returns already-sorted
    return [...items].sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));
  }, [items]);

  function loadCacheInstant() {
    try {
      const cached = localStorage.getItem(CATS_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length) {
          setItems(parsed);
        }
      }
    } catch {
      // ignore
    }
  }

  async function refresh({ silent = false } = {}) {
    if (!silent) setRefreshing(true);
    setMsg("");

    // instant cache for better UX (no waiting)
    loadCacheInstant();

    try {
      console.time("LIST_CATEGORIES");
      const res = await listCategories(150); // uses your updated service with limit()
      console.timeEnd("LIST_CATEGORIES");

      const list = Array.isArray(res) ? res : [];
      setItems(list);
      localStorage.setItem(CATS_CACHE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error(e);
      setMsg(`Failed to load categories: ${e?.message || "Unknown error"}`);
    } finally {
      if (!silent) setRefreshing(false);
      if (silent) setRefreshing(false);
    }
  }

  useEffect(() => {
    refresh({ silent: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function add() {
  setMsg("");

  try {
    if (!name.trim()) return setMsg("Enter category name.");

    setSaving(true);

    let imageUrl = "";
    if (file) {
      setMsg("Uploading image...");
      imageUrl = await uploadToCloudinary(file, "begorgeous/categories");
    }

    setMsg("Creating category...");
    const id = await createCategory({ name: name.trim(), note: note.trim(), imageUrl });

    // ✅ Optimistic UI update (so it appears instantly)
    setItems((prev) => [
      { id, name: name.trim(), note: note.trim(), imageUrl, createdAtMs: Date.now() },
      ...prev,
    ]);

    // ✅ Clear inputs immediately (so you can edit again)
    setName("");
    setNote("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    // ✅ Stop loader NOW (no hanging)
    setSaving(false);

    setMsg("Category added ✅");

    // ✅ Refresh in background (DON’T await)
    refresh({ silent: true });
  } catch (e) {
    console.error(e);
    setMsg(`Error: ${e?.message || "Failed to add category"}`);
    setSaving(false);
  }
}


  async function del(id, catName) {
    setMsg("");
    const ok = window.confirm(`Delete category "${catName}"?`);
    if (!ok) return;

    // Optimistic UI remove (feels instant)
    const prev = items;
    setItems((p) => p.filter((x) => x.id !== id));
    setDeletingId(id);

    try {
      await removeCategory(id);
      setMsg("Category deleted ✅");
      // optional: refresh in background to ensure perfect sync
      refresh({ silent: true });
    } catch (e) {
      console.error(e);
      // rollback if failed
      setItems(prev);
      setMsg(e?.message || "Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="adminHeadRow">
        <div>
          <h2 className="h2">Categories</h2>
          <p className="p">Create collections.</p>
        </div>

        <button
          className="btn ghost"
          onClick={() => refresh()}
          disabled={refreshing}
          title="Fetch latest categories"
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="adminFormCard">
        <div className="formGrid">
          <input
            className="input"
            placeholder="Category name (e.g., Rings)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
          />

          <input
            className="input"
            placeholder="Short note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={saving}
          />

          <input
            ref={fileInputRef}
            className="input"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            disabled={saving}
          />

          <button className="btn primary" onClick={add} disabled={saving}>
            {saving ? "Saving..." : "Add Category"}
          </button>
        </div>

        {msg && (
          <div className="err" style={{ marginTop: 10 }}>
            {msg}
          </div>
        )}
      </div>

      <div className="adminList">
        {refreshing && sortedItems.length === 0 && (
          <div className="emptyHint">Loading categories…</div>
        )}

        {sortedItems.map((c) => (
          <div key={c.id} className="adminRow">
            <div className="adminRowLeft">
              <img
                className="miniImg"
                src={c.imageUrl || "/sample.png"}
                alt={c.name}
                loading="lazy"
              />
              <div>
                <div className="strong">{c.name}</div>
                <div className="muted">{c.note || "—"}</div>
              </div>
            </div>

            <div className="adminRowActions">
              <button
                className="btn ghost"
                onClick={() => del(c.id, c.name)}
                disabled={deletingId === c.id}
              >
                {deletingId === c.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}

        {!refreshing && sortedItems.length === 0 && (
          <div className="emptyHint">No categories yet.</div>
        )}
      </div>
    </div>
  );
}
