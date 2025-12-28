export default function CategoryGrid({ cats, onOpenCategory }) {
  return (
    <section className="container section" id="collections">
      <div className="sectionHead">
        <div>
          <h2 className="h2">Collections</h2>
          <p className="p">Browse by category.</p>
        </div>
      </div>

      <div className="rowScroll">
        {cats.map((c) => (
          <button
            key={c.id}
            className="catCard"
            onClick={() => onOpenCategory(c.id)}
            title={c.name}
          >
            <div className="catTop">
              <div className="catName">{c.name}</div>
              <div className="catArrow">→</div>
            </div>
            <div className="catNote">{c.note || "Explore premium picks"}</div>
          </button>
        ))}

        {cats.length === 0 && (
          <div className="emptyHint">
            No categories yet. Add from <b>Admin → Categories</b>.
          </div>
        )}
      </div>
    </section>
  );
}
