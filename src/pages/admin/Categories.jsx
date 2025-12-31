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

  // ✅ search (UI-only)
  const [q, setQ] = useState("");

  // ✅ popup state
  const [openCreate, setOpenCreate] = useState(false);

  const sortedItems = useMemo(() => {
    // Keep newest first even if backend returns already-sorted
    return [...items].sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));
  }, [items]);

  const filteredItems = useMemo(() => {
    const queryText = (q || "").trim().toLowerCase();
    if (!queryText) return sortedItems;
    return sortedItems.filter((c) => {
      const nm = String(c?.name || "").toLowerCase();
      const nt = String(c?.note || "").toLowerCase();
      return nm.includes(queryText) || nt.includes(queryText);
    });
  }, [sortedItems, q]);

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

  useEffect(() => {
  if (!msg) return;
  const t = setTimeout(() => setMsg(""), 3500); // auto hide
  return () => clearTimeout(t);
}, [msg]);


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

      // ✅ close popup after add
      setOpenCreate(false);

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

  function openModal() {
    setMsg("");
    setOpenCreate(true);
  }

  function closeModal() {
    setOpenCreate(false);
  }

  return (
    <div>
      <div className="adminHeadRow">
        <div>
          <h2 className="h2">Categories</h2>
          <p className="p">Create collections.</p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {/* ✅ Add Collection button BEFORE refresh */}
          <button
            className="btn primary"
            onClick={openModal}
            disabled={saving}
            title="Create a new collection"
            style={{
              borderRadius: 999,
              padding: "10px 14px",
              fontWeight: 900,
              boxShadow: "0 14px 30px rgba(73, 54, 40, 0.16)",
              whiteSpace: "nowrap",
            }}
          >
            Add Collection
          </button>

          <button
            className="btn ghost"
            onClick={() => refresh()}
            disabled={refreshing}
            title="Fetch latest categories"
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {msg && (
  <div
    style={{
      position: "fixed",
      left: "50%",
      top: 18,
      transform: "translateX(-50%)",
      zIndex: 60,
      width: "min(560px, 92vw)",
      borderRadius: 18,
      padding: 2,
      background:
        "linear-gradient(135deg, rgba(171,136,109,0.35), rgba(214,192,179,0.22))",
      boxShadow: "0 18px 55px rgba(73, 54, 40, 0.16)",
    }}
  >
    <div
      style={{
        borderRadius: 16,
        padding: "12px 14px",
        background: "#fff",
        border: "1px solid rgba(171, 136, 109, 0.18)",
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
      }}
    >
      {/* icon */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 14,
          background: "rgba(214, 192, 179, 0.45)",
          color: "#493628",
          display: "grid",
          placeItems: "center",
          fontWeight: 900,
          flex: "0 0 auto",
        }}
      >
        !
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 950, color: "#493628", marginBottom: 2 }}>
          Notice
        </div>
        <div style={{ color: "rgba(73,54,40,0.78)", lineHeight: 1.5 }}>
          {msg}
        </div>
      </div>

      {/* close */}
      <button
        type="button"
        onClick={() => setMsg("")}
        className="btn ghost"
        style={{
          width: 38,
          height: 38,
          padding: 0,
          borderRadius: 14,
          display: "grid",
          placeItems: "center",
          flex: "0 0 auto",
        }}
        aria-label="Close message"
        title="Close"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M18 6 6 18M6 6l12 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  </div>
)}


      {/* ✅ POPUP MODAL: Create Collection */}
      {openCreate && (
        <div
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            // click outside closes
            if (e.target === e.currentTarget) closeModal();
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(255, 248, 245, 0.45)",
            display: "grid",
            placeItems: "center",
            padding: "18px",
          }}
        >
          <div
            className="adminFormCard"
            style={{
              width: "min(520px, 92vw)", // ✅ lesser width
              borderRadius: 22,
              border: "1px solid rgba(171, 136, 109, 0.22)",
              background: "#ffffff",

              boxShadow: "0 30px 90px rgba(0,0,0,0.30)",
              padding: 16,
              position: "relative",
            }}
          >
            {/* top row */}
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div>
                <div style={{ fontWeight: 950, color: "#493628", fontSize: 18, letterSpacing: "-0.01em" }}>
                  Create Collection
                </div>
                <div style={{ marginTop: 6, color: "rgba(73,54,40,0.70)", fontWeight: 700, fontSize: 13 }}>
                  create a new category
                </div>
              </div>

              {/* ✅ Back button - smaller width */}
              <button
                className="btn ghost"
                onClick={closeModal}
                type="button"
                style={{
                  borderRadius: 999,
                  padding: "8px 10px",
                  minWidth: 76,
                  height: 38,
                  whiteSpace: "nowrap",
                }}
              >
                Back
              </button>
            </div>

            <div style={{ height: 12 }} />

            {/* form */}
            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <div
                  style={{
                    fontWeight: 900,
                    color: "#493628",
                    fontSize: 13,
                    marginBottom: 8,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Category title
                </div>
                <input
                  className="input"
                  placeholder="e.g., Rings"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={saving}
                  style={{
                    borderRadius: 16,
                    border: "1px solid rgba(171, 136, 109, 0.22)",
                    background: "rgba(255,255,255,0.85)",
                    boxShadow: "0 12px 26px rgba(73, 54, 40, 0.08)",
                  }}
                />
              </div>

              <div>
                <div
                  style={{
                    fontWeight: 900,
                    color: "#493628",
                    fontSize: 13,
                    marginBottom: 8,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Short description
                </div>
                <input
                  className="input"
                  placeholder="Optional short note (e.g., Minimal daily wear)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={saving}
                  style={{
                    borderRadius: 16,
                    border: "1px solid rgba(171, 136, 109, 0.22)",
                    background: "rgba(255,255,255,0.85)",
                    boxShadow: "0 12px 26px rgba(73, 54, 40, 0.08)",
                  }}
                />
              </div>

              <div>
                <div
                  style={{
                    fontWeight: 900,
                    color: "#493628",
                    fontSize: 13,
                    marginBottom: 8,
                    letterSpacing: "-0.01em",
                  }}
                >
                  DP image
                </div>
                <input
                  ref={fileInputRef}
                  className="input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  disabled={saving}
                  style={{
                    borderRadius: 16,
                    border: "1px solid rgba(171, 136, 109, 0.22)",
                    background: "rgba(255,255,255,0.85)",
                    boxShadow: "0 12px 26px rgba(73, 54, 40, 0.08)",
                    paddingTop: 12,
                    paddingBottom: 12,
                  }}
                />
              </div>

              <button
                className="btn primary"
                onClick={add}
                disabled={saving}
                style={{
                  borderRadius: 999,
                  padding: "12px 14px",
                  fontWeight: 900,
                  boxShadow: "0 16px 34px rgba(73, 54, 40, 0.18)",
                }}
              >
                {saving ? "Saving..." : "Add Category"}
              </button>

              {msg && (
                <div className="err" style={{ marginTop: 4 }}>
                  {msg}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ✅ List container with search + fixed height scroll */}
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
        {/* Search bar */}
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
              <span style={{ color: "#493628", opacity: 0.85, display: "grid", placeItems: "center" }}>
                {SearchIcon}
              </span>

              <input
                className="input"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search categories..."
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

          {!refreshing && (q || "").trim() && (
            <div className="muted" style={{ marginTop: 8, color: "rgba(73,54,40,0.70)", fontWeight: 700 }}>
              Showing {filteredItems.length} of {sortedItems.length}
            </div>
          )}
        </div>

        {/* Scroll list */}
        <div
          className="adminList"
          style={{
            maxHeight: 420,
            overflow: "auto",
            paddingRight: 6,
          }}
        >
          {refreshing && sortedItems.length === 0 && (
            <div className="emptyHint">Loading categories…</div>
          )}

          {filteredItems.map((c) => (
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

          {!refreshing && filteredItems.length === 0 && (
            <div className="emptyHint">
              {(q || "").trim() ? "No matching categories." : "No categories yet."}
            </div>
          )}
        </div>
      </div>

      {/* polish for scrollbars + mobile spacing (scoped) */}
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
