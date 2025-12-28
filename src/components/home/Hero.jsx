import React from "react";

export default function Hero({ heroImg }) {
  return (
    <section className="container hero">
      <div className="heroGrid">
        <div className="heroLeft">
          <div className="pill">✨ Soft luxury • Pink & white • Premium</div>

          <h1 className="h1">
            Be <span>gorgeous</span> in every moment.
          </h1>

          <p className="lead">
            Elegant rings, earrings, necklaces, bangles and bridal sets — a boutique experience that feels premium.
          </p>

          <div className="heroActions">
            <a className="btn primary" href="#collections">Explore collections</a>
            <a className="btn ghost" href="#featured">Featured picks</a>
          </div>

          <div className="heroMiniStats">
            <div className="miniStat">
              <div className="miniTop">New arrivals</div>
              <div className="miniSub">Fresh drops</div>
            </div>
            <div className="miniStat">
              <div className="miniTop">Packaging</div>
              <div className="miniSub">Gift-ready</div>
            </div>
            <div className="miniStat">
              <div className="miniTop">Ordering</div>
              <div className="miniSub">Fast & simple</div>
            </div>
          </div>
        </div>

        <div className="heroRight">
          <div className="heroCard">
            <div className="heroImgWrap">
              <img className="heroImage" src={heroImg} alt="BeGorgeous" />
              <div className="heroGlow" />
            </div>

            <div className="heroMeta">
              <div className="metaRow">
                <span>Premium finish</span><span className="muted">handpicked</span>
              </div>
              <div className="metaRow">
                <span>Minimal design</span><span className="muted">timeless</span>
              </div>
              <div className="metaRow">
                <span>Quick support</span><span className="muted">WhatsApp</span>
              </div>
            </div>
          </div>

          <div className="heroBadge">
            <span className="dot" />
            Boutique picks • curated daily
          </div>
        </div>
      </div>
    </section>
  );
}
