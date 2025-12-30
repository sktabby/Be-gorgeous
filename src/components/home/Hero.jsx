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
    <section style={{ background: "#E4E0E1", padding: "28px 0" }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "0 16px" }}>
        {/* OUTER FRAME */}
        <div
          style={{
            borderRadius: "24px",
            border: "1px solid rgba(171, 136, 109, 0.22)",
            padding: "24px",
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(18px)",
            boxShadow:
              "0 18px 55px rgba(73, 54, 40, 0.12), inset 0 1px 0 rgba(255,255,255,0.55)",
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
            {/* LEFT CONTENT */}
            <div>
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 14px",
                  borderRadius: "999px",
                  background:
                    "linear-gradient(180deg, rgba(214,192,179,0.65), rgba(214,192,179,0.35))",
                  color: "#493628",
                  fontSize: "13px",
                  fontWeight: 800,
                  border: "1px solid rgba(171, 136, 109, 0.22)",
                  boxShadow: "0 10px 22px rgba(73, 54, 40, 0.08)",
                }}
              >
                anti-tarnish • everyday shine
              </span>

              <h1
                style={{
                  marginTop: "16px",
                  fontSize: "clamp(32px, 5vw, 52px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  fontWeight: 800,
                  color: "#493628",
                }}
              >
                Be <span style={{ color: "#AB886D" }}>gorgeous</span>
                <br />
                in every moment
              </h1>

              {/* DESCRIPTION — DESKTOP ONLY */}
              {isDesktop && (
                <p
                  style={{
                    marginTop: "14px",
                    maxWidth: "520px",
                    lineHeight: 1.7,
                    color: "rgba(73, 54, 40, 0.72)",
                    fontSize: "15.5px",
                  }}
                >
                  Premium anti-tarnish jewellery made for daily wear — rings,
                  earrings, chains, bangles & sets that keep their glow longer and
                  look effortless every time you style them.
                </p>
              )}

              {/* ACTION BUTTONS */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginTop: "22px",
                  flexWrap: "nowrap",
                }}
              >
                <a
                  href="#collections"
                  style={{
                    flex: 1,
                    padding: "12px 0",
                    textAlign: "center",
                    borderRadius: "999px",
                    background: "linear-gradient(180deg, #AB886D, #7B563B)",
                    color: "#fff",
                    fontWeight: 800,
                    textDecoration: "none",
                    boxShadow: "0 12px 28px rgba(73, 54, 40, 0.22)",
                    border: "1px solid rgba(171, 136, 109, 0.18)",
                  }}
                >
                  Explore
                </a>

                <a
                  href="#featured"
                  style={{
                    flex: 1,
                    padding: "12px 0",
                    textAlign: "center",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.45)",
                    color: "#493628",
                    fontWeight: 800,
                    textDecoration: "none",
                    border: "1px solid rgba(171, 136, 109, 0.24)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    boxShadow: "0 10px 22px rgba(73, 54, 40, 0.10)",
                  }}
                >
                  Featured
                </a>
              </div>
            </div>

            {/* RIGHT IMAGE — DESKTOP */}
            {isDesktop && (
              <div
                style={{
                  borderRadius: "22px",
                  overflow: "hidden",
                  border: "1px solid rgba(171, 136, 109, 0.22)",
                  background: "rgba(255,255,255,0.45)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  boxShadow:
                    "0 18px 55px rgba(73, 54, 40, 0.12), inset 0 1px 0 rgba(255,255,255,0.55)",
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
                    filter: "saturate(0.98) contrast(1.03)",
                  }}
                />
              </div>
            )}

            {/* MOBILE IMAGE CARD */}
            {!isDesktop && (
              <div
                style={{
                  marginTop: 10,
                  borderRadius: 20,
                  height: 240,
                  position: "relative",
                  overflow: "hidden",
                  backgroundImage: `url(${sampleImg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  border: "1px solid rgba(171,136,109,0.22)",
                  boxShadow:
                    "0 18px 40px rgba(73,54,40,0.18)",
                }}
              >
                {/* gradient overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(73,54,40,0.65), rgba(73,54,40,0.05))",
                  }}
                />

                {/* tagline on image */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    right: 16,
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 15,
                    lineHeight: 1.4,
                  }}
                >
                  Anti-tarnish jewellery crafted for everyday elegance
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
