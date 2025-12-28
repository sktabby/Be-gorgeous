import React from "react";
export default function Dashboard() {
  return (
    <div>
      <h2 className="h2">Dashboard</h2>
      <p className="p">Quick access to manage your store.</p>

      <div className="adminCards">
        <div className="adminCard">
          <div className="adminCardTitle">Categories</div>
          <div className="muted">Create and organize collections.</div>
        </div>
        <div className="adminCard">
          <div className="adminCardTitle">Products</div>
          <div className="muted">Add products with images, size and care.</div>
        </div>
      </div>
    </div>
  );
}
