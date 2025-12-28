import React from "react";

const reviews = [
  { name: "Ayesha", txt: "The finishing looks premium — feels like a boutique purchase.", tag: "Verified buyer" },
  { name: "Riya", txt: "Packaging was beautiful. Loved the minimal and elegant look.", tag: "Repeat customer" },
  { name: "Meher", txt: "Fast response and smooth ordering. Super simple on WhatsApp.", tag: "Happy customer" },
];

export default function Testimonials() {
  return (
    <section className="container section">
      <div className="sectionHead">
        <div>
          <h2 className="h2">Loved by customers</h2>
          <p className="p">A premium experience — from browsing to delivery.</p>
        </div>
      </div>

      <div className="testGrid">
        {reviews.map((r) => (
          <div key={r.name} className="testCard">
            <div className="testTop">
              <div className="avatar">{r.name.slice(0, 1)}</div>
              <div>
                <div className="testName">{r.name}</div>
                <div className="testTag">{r.tag}</div>
              </div>
            </div>

            <div className="testTxt">“{r.txt}”</div>
            <div className="stars">★★★★★</div>
          </div>
        ))}
      </div>
    </section>
  );
}
