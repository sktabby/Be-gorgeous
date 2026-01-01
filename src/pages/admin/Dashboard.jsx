import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  getCountFromServer,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../app/firebase/db.js"; // ✅ keep .js if your file is db.js

import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function formatDayKey(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
function prettyDayLabel(key) {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, { day: "2-digit", month: "short" });
}

const RANGE = { TODAY: "today", WEEK: "7d", MONTH: "30d", ALL: "all" };

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(RANGE.WEEK);
  const [err, setErr] = useState("");

  // ✅ manual refresh trigger
  const [refreshKey, setRefreshKey] = useState(0);

  const [counts, setCounts] = useState({
    products: 0,
    categories: 0,
    whatsappRedirects: 0,
  });

  const [trend, setTrend] = useState([]);
  const [topProduct, setTopProduct] = useState(null); // { name, qty }

  const rangeStart = useMemo(() => {
    const now = new Date();
    if (range === RANGE.ALL) return null;

    const d = startOfDay(now);
    if (range === RANGE.TODAY) return Timestamp.fromDate(d);

    if (range === RANGE.WEEK) {
      d.setDate(d.getDate() - 6);
      return Timestamp.fromDate(d);
    }

    if (range === RANGE.MONTH) {
      d.setDate(d.getDate() - 29);
      return Timestamp.fromDate(d);
    }

    return null;
  }, [range]);

  const tooltipBox = {
    background: "rgba(255,255,255,0.95)",
    border: "1px solid rgba(171,136,109,0.22)",
    borderRadius: 14,
    boxShadow: "0 18px 45px rgba(73,54,40,0.12)",
    padding: "10px 12px",
    color: "#493628",
    fontWeight: 800,
  };

  function BarTip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    const v = payload[0]?.value ?? 0;
    return (
      <div style={tooltipBox}>
        <div style={{ fontWeight: 950, marginBottom: 4 }}>{label}</div>
        <div style={{ fontWeight: 900, opacity: 0.85 }}>
          Redirects: {Number(v)}
        </div>
      </div>
    );
  }

  function doRefresh() {
    setErr("");
    setRefreshKey((k) => k + 1); // ✅ re-run fetch effect
  }

  useEffect(() => {
    (async () => {
      try {
        setErr("");
        setLoading(true);

        // ✅ totals (these already reflect deletes)
        const [p, c] = await Promise.all([
          getCountFromServer(collection(db, "products")),
          getCountFromServer(collection(db, "categories")),
        ]);

        // ✅ fetch current products -> for removing stale analytics items
        const prodSnap = await getDocs(collection(db, "products"));
        const existingProductNames = new Set(
          prodSnap.docs
            .map((d) => d.data()?.title)
            .filter(Boolean)
            .map((t) => String(t).trim())
        );

        // ✅ events (whatsapp redirects)
        const base = collection(db, "analytics_events");

        // NOTE: may need composite index (type + at) when rangeStart is used.
        const qEvents = rangeStart
          ? query(
              base,
              where("type", "==", "whatsapp_redirect"),
              where("at", ">=", rangeStart)
            )
          : query(base, where("type", "==", "whatsapp_redirect"));

        const snap = await getDocs(qEvents);
        const events = snap.docs.map((d) => d.data());

        // Trend by day (trend stays valid, even if some products were deleted)
        const dayMap = new Map();
        events.forEach((e) => {
          const ts = e.at?.toDate ? e.at.toDate() : null;
          if (!ts) return;
          const key = formatDayKey(startOfDay(ts));
          dayMap.set(key, (dayMap.get(key) || 0) + 1);
        });

        const buildTrend = () => {
          const now = startOfDay(new Date());

          if (range === RANGE.ALL) {
            const keys = Array.from(dayMap.keys()).sort();
            return keys.map((k) => ({
              day: prettyDayLabel(k),
              redirects: dayMap.get(k) || 0,
            }));
          }

          const points =
            range === RANGE.TODAY ? 1 : range === RANGE.WEEK ? 7 : 30;

          const list = [];
          const d = new Date(now);
          d.setDate(d.getDate() - (points - 1));
          for (let i = 0; i < points; i++) {
            const key = formatDayKey(d);
            list.push({
              day: prettyDayLabel(key),
              redirects: dayMap.get(key) || 0,
            });
            d.setDate(d.getDate() + 1);
          }
          return list;
        };

        // ✅ Top product by qty in events (ONLY if product still exists)
        const prodCounts = new Map();
        events.forEach((e) => {
          const items = Array.isArray(e.items) ? e.items : [];
          items.forEach((it) => {
            const rawName = it.name || "Unknown";
            const name = String(rawName).trim();
            if (!existingProductNames.has(name)) return; // ✅ ignore deleted products

            const qty = Number(it.qty || 1);
            prodCounts.set(name, (prodCounts.get(name) || 0) + qty);
          });
        });

        let best = null;
        for (const [name, qty] of prodCounts.entries()) {
          if (!best || qty > best.qty) best = { name, qty };
        }

        setCounts({
          products: p.data().count,
          categories: c.data().count,
          whatsappRedirects: events.length,
        });

        setTrend(buildTrend());
        setTopProduct(best);
      } catch (e) {
        console.error(e);
        setErr(e?.message || String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [range, rangeStart, refreshKey]);

  return (
    <div>
      {/* ✅ Premium header + chips + refresh */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 12,
        }}
      >
        <div>
          <h2 className="h2" style={{ margin: 0, color: "#493628" }}>
            Dashboard
          </h2>
          <p
            className="p"
            style={{ margin: "6px 0 0", color: "rgba(73,54,40,0.68)" }}
          >
            Analytics from WhatsApp checkout clicks.
          </p>
        </div>
<button
  onClick={doRefresh}
  disabled={loading}
  title="Refresh analytics"
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: 8,

    borderRadius: 999,
    padding: "8px 14px",
    fontWeight: 900,
    letterSpacing: "-0.01em",

    border: "1px solid rgba(171, 136, 109, 0.28)",
    background: loading
      ? "linear-gradient(180deg, rgba(240,235,230,0.9), rgba(225,215,205,0.85))"
      : "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(214,192,179,0.30))",

    color: "#493628",

    boxShadow: loading
      ? "0 8px 18px rgba(73, 54, 40, 0.10)"
      : "0 14px 30px rgba(73, 54, 40, 0.16)",

    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.7 : 1,
    whiteSpace: "nowrap",

    transition:
      "transform .14s ease, box-shadow .14s ease, filter .14s ease",
  }}
  onMouseEnter={(e) => {
    if (loading) return;
    e.currentTarget.style.transform = "translateY(-1px)";
    e.currentTarget.style.boxShadow =
      "0 18px 38px rgba(73, 54, 40, 0.22)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = loading
      ? "0 8px 18px rgba(73, 54, 40, 0.10)"
      : "0 14px 30px rgba(73, 54, 40, 0.16)";
  }}
>
  {/* Icon */}
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    style={{
      animation: loading ? "spin 1.1s linear infinite" : "none",
    }}
  >
    <path
      d="M21 12a9 9 0 1 1-2.64-6.36"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M21 3v6h-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>

  {loading ? "Refreshing…" : "Refresh"}
</button>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          

          {[
            { k: RANGE.TODAY, t: "Today" },
            { k: RANGE.WEEK, t: "7 days" },
            { k: RANGE.MONTH, t: "30 days" },
            { k: RANGE.ALL, t: "All time" },
          ].map((x) => (
            <button
              key={x.k}
              onClick={() => setRange(x.k)}
              style={{
                borderRadius: 999,
                padding: "7px 12px",
                fontWeight: 900,
                letterSpacing: "-0.01em",
                border: "1px solid rgba(171, 136, 109, 0.22)",
                background:
                  range === x.k
                    ? "rgba(214, 192, 179, 0.55)"
                    : "rgba(255,255,255,0.80)",
                color: "#493628",
                boxShadow:
                  range === x.k
                    ? "0 12px 26px rgba(73, 54, 40, 0.12)"
                    : "0 10px 22px rgba(73, 54, 40, 0.08)",
                cursor: "pointer",
              }}
            >
              {x.t}
            </button>
          ))}
        </div>
      </div>

      {err ? (
        <div
          className="emptyHint"
          style={{
            marginTop: 10,
            borderRadius: 16,
            border: "1px solid rgba(120, 60, 60, 0.25)",
            background: "rgba(255, 230, 230, 0.65)",
            color: "#4a1f1f",
            padding: "12px 14px",
          }}
        >
          <b>Dashboard error:</b> {err}
        </div>
      ) : null}

      <div
        style={{
          borderRadius: 22,
          border: "1px solid rgba(171,136,109,0.22)",
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 22px 60px rgba(73,54,40,0.12)",
          padding: 14,
          maxHeight: 620,
          overflow: "auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: 10,
            marginBottom: 12,
          }}
        >
          {[
            { t: "Products", v: counts.products, sub: "Total items listed" },
            { t: "Categories", v: counts.categories, sub: "Collections created" },
            {
              t: "WhatsApp Redirects",
              v: counts.whatsappRedirects,
              sub: "Checkout clicks",
            },
            {
              t: "Top Product",
              v: loading ? "—" : topProduct?.name || "—",
              sub: loading
                ? "Calculating…"
                : topProduct
                ? `Qty ordered: ${topProduct.qty}`
                : "No product data logged (or top product was deleted)",
              wide: true,
            },
          ].map((x) => (
            <div
              key={x.t}
              style={{
                gridColumn: x.wide ? "span 2" : "span 1",
                borderRadius: 18,
                border: "1px solid rgba(171, 136, 109, 0.20)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(214,192,179,0.12))",
                boxShadow: "0 14px 34px rgba(73, 54, 40, 0.08)",
                padding: 12,
                minHeight: 92,
              }}
            >
              <div
                style={{
                  fontWeight: 950,
                  color: "#493628",
                  letterSpacing: "-0.01em",
                  fontSize: 13,
                }}
              >
                {x.t}
              </div>

              <div
                style={{
                  marginTop: 8,
                  fontSize: x.t === "Top Product" ? 16 : 24,
                  fontWeight: 950,
                  color: "#493628",
                  lineHeight: 1.15,
                  wordBreak: "break-word",
                }}
              >
                {loading ? "—" : x.v}
              </div>

              <div
                style={{
                  marginTop: 8,
                  color: "rgba(73,54,40,0.65)",
                  fontWeight: 700,
                  fontSize: 12.5,
                }}
              >
                {x.sub}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            borderRadius: 18,
            border: "1px solid rgba(171, 136, 109, 0.18)",
            background: "#fff",
            boxShadow: "0 14px 34px rgba(73, 54, 40, 0.08)",
            padding: 12,
          }}
        >
          <div
            style={{
              fontWeight: 950,
              color: "#493628",
              letterSpacing: "-0.01em",
              marginBottom: 8,
              fontSize: 14,
            }}
          >
            WhatsApp Redirects (Daily)
          </div>

          {loading ? (
            <div className="muted">Loading…</div>
          ) : trend.length === 0 ? (
            <div className="muted">No redirects found for this range.</div>
          ) : (
            <ResponsiveContainer width="100%" height={190}>
              <BarChart
                data={trend}
                margin={{ top: 8, right: 10, left: 0, bottom: 8 }}
                barCategoryGap="22%"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  tickMargin={8}
                  tick={{ fontSize: 12, fontWeight: 800, fill: "#493628" }}
                />
                <YAxis
                  allowDecimals={false}
                  tickMargin={8}
                  tick={{ fontSize: 12, fontWeight: 800, fill: "#493628" }}
                />
                <Tooltip content={<BarTip />} />
                <Legend
                  verticalAlign="top"
                  height={18}
                  wrapperStyle={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: "#493628",
                  }}
                />
                <Bar dataKey="redirects" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
