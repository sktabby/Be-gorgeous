import React from "react";

export default function FooterCTA({ onExplore, onFeatured }) {
  return (
    <section className="container section ctaSection">
      <div className="ctaCard">
        <div className="ctaLeft">
          <div className="ctaPill">✨ Premium • Minimal • Elegant</div>

          <h3 className="ctaTitle">Ready to find your next favorite piece?</h3>
          <p className="ctaText">
            Explore collections, pick what you love, and place your order in seconds.
          </p>

          <div className="ctaActions">
            <button className="btn primary" onClick={onExplore}>Explore collections</button>
            <button className="btn ghost" onClick={onFeatured}>Featured picks</button>
          </div>
        </div>

        <div className="ctaRight">
          <div className="ctaMini">
            <div className="ctaMiniTitle">Fast ordering</div>
            <div className="ctaMiniText">Cart → checkout → WhatsApp</div>
          </div>
          <div className="ctaMini">
            <div className="ctaMiniTitle">Gift-ready</div>
            <div className="ctaMiniText">Secure premium packaging</div>
          </div>
          <div className="ctaMini">
            <div className="ctaMiniTitle">Support</div>
            <div className="ctaMiniText">Quick replies</div>
          </div>
        </div>
      </div>

      <div className="footerNote">
        © {new Date().getFullYear()} BeGorgeous • Crafted with care
      </div>
    </section>
  );
}
