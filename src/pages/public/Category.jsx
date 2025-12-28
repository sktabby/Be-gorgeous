import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { listByCategory } from "../../services/products.service";
import ProductCard from "../../components/products/ProductCard";

export default function Category() {
  const { categoryId } = useParams();
  const nav = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await listByCategory(categoryId);
      setItems(res);
    })();
  }, [categoryId]);

  return (
    <div className="container section">
      <div className="pageHead">
        <div>
          <h2 className="h2">Collection</h2>
          <p className="p">{categoryId}</p>
        </div>
        <button className="btn ghost" onClick={() => nav(-1)}>Back</button>
      </div>

      <div className="grid3" style={{ marginTop: 16 }}>
        {items.map((p) => <ProductCard key={p.id} p={p} />)}
        {items.length === 0 && <div className="emptyHint">No products in this collection yet.</div>}
      </div>
    </div>
  );
}
