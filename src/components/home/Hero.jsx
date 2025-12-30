import { useEffect, useState } from "react";
import sampleImg from "../../assets/images/Hero_img.jpg";

export default function Hero() {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 900 : true
  );

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 900);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <section style={{ background: "#fff", padding: "28px 0" }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "0 16px" }}>
        {/* OUTER FRAME */}
        <div
          style={{
            borderRadius: "24px",
            border: "1px solid rgba(0,0,0,0.08)",
            padding: "24px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            background: "#fff",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: "32px",
              gridTemplateColumns: isDesktop ? "1.1fr 0.9fr" : "1fr",
              alignItems: "center",
            }}
          >
            {/* LEFT CONTENT (ALWAYS VISIBLE) */}
            <div>
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 14px",
                  borderRadius: "999px",
                  background: "#ffe4f0",
                  color: "#ff4fa3",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                luxury jewellery
              </span>

              <h1
                style={{
                  marginTop: "16px",
                  fontSize: "clamp(32px, 5vw, 52px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  fontWeight: 800,
                  color: "#1c1c1c",
                }}
              >
                Be <span style={{ color: "#ff4fa3" }}>gorgeous</span>
                <br />
                in every moment
              </h1>

              <p
                style={{
                  marginTop: "14px",
                  maxWidth: "520px",
                  lineHeight: 1.7,
                  color: "#6f6f6f",
                  fontSize: "15.5px",
                }}
              >
                Elegant rings, earrings, necklaces, bangles and bridal sets —
                crafted for timeless beauty and everyday grace.
              </p>

              {/* ACTION BUTTONS */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginTop: "22px",
                  flexWrap: "wrap",
                }}
              >
                <a
                  href="#collections"
                  style={{
                    padding: "12px 22px",
                    borderRadius: "999px",
                    background: "#ff4fa3",
                    color: "#fff",
                    fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 10px 24px rgba(255,79,163,0.25)",
                  }}
                >
                  Explore collections
                </a>

                <a
                  href="#featured"
                  style={{
                    padding: "12px 22px",
                    borderRadius: "999px",
                    background: "#f4f4f4",
                    color: "#1c1c1c",
                    fontWeight: 700,
                    textDecoration: "none",
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  Featured picks
                </a>
              </div>

              {/* MINI STATS — DESKTOP */}
              {isDesktop && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "14px",
                    marginTop: "28px",
                  }}
                >
                  {[
                    ["New arrivals", "Fresh drops"],
                    ["Packaging", "Gift-ready"],
                    ["Ordering", "Fast & simple"],
                  ].map(([t, s]) => (
                    <div
                      key={t}
                      style={{
                        border: "1px solid rgba(0,0,0,0.08)",
                        borderRadius: "16px",
                        padding: "14px",
                        background: "#fff",
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>{t}</div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#777",
                          marginTop: "4px",
                        }}
                      >
                        {s}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* MINI STAT — MOBILE */}
              {!isDesktop && (
                <div
                  style={{
                    marginTop: "22px",
                    border: "1px solid rgba(255, 32, 214, 0.08)",
                    borderRadius: "10px",
                    padding: "5px",
                    background: "#ffffffff",
                    textAlign:"center"
                  }}
                >
                  
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#949494ff",
                      marginTop: "4px",
                    }}
                  >
                    order your favorite one now!
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT IMAGE — DESKTOP ONLY */}
            {isDesktop && (
              <div
                style={{
                  borderRadius: "22px",
                  overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.08)",
                  background: "#fafafa",
                }}
              >
                <img
                  src={sampleImg}
                  alt="BeGorgeous jewellery"
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
