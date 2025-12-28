import React from "react";
import ProductCard from "../products/ProductCard";

export default function FeaturedProducts({ featured, onGoCart }) {
  return (
    <section className="container section" id="featured">
      <div className="sectionHead">
        <div>
          <h2 className="h2">Featured</h2>
          <p className="p">A few premium picks.</p>
        </div>

        <button className="btn ghost" onClick={onGoCart}>
          Go to cart
        </button>
      </div>

      <div className="grid3">
        {featured.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}

        {featured.length === 0 && (
          <div className="emptyHint">
            No featured products yet. Add from <b>Admin → Products</b>.
          </div>
        )}
      </div>
    </section>
  );
}
