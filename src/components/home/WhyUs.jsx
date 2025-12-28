import React from "react";

const items = [
  { t: "Care", d: "Avoid water & perfume. Store in a dry box for long-lasting shine." },
  { t: "Delivery", d: "Quick dispatch. Packaging is secure and gift-ready." },
  { t: "Ordering", d: "Add to cart → checkout → send your order with one tap." },
];

export default function WhyUs() {
  return (
    <section className="container section" id="care">
      <div className="sectionHead">
        <div>
          <h2 className="h2">Care & Delivery</h2>
          <p className="p">Simple policies, premium feel.</p>
        </div>
      </div>

      <div className="infoGrid">
        {items.map((x) => (
          <div key={x.t} className="infoCard">
            <div className="infoIcon">✦</div>
            <div className="infoTitle">{x.t}</div>
            <div className="infoText">{x.d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
