// export function openWhatsAppOrder(items) {
//   const safe = Array.isArray(items) ? items : [];

//   if (!safe.length) {
//     alert("Cart is empty!");
//     return;
//   }

//   const lines = safe.map((x) => {
//     const name = x.name ?? x.title ?? "Item";
//     const qty = Number(x.qty ?? 1);
//     const price = Number(x.price ?? x.mrp ?? 0);
//     const lineTotal = qty * price;

//     return `• ${name} × ${qty} — ₹${lineTotal}`;
//   });

//   const total = safe.reduce((sum, x) => {
//     const qty = Number(x.qty ?? 1);
//     const price = Number(x.price ?? x.mrp ?? 0);
//     return sum + qty * price;
//   }, 0);

//   const msg =
//     `Hi, I want to order:\n\n` +
//     lines.join("\n") +
//     `\n\nTotal: ₹${total}\n\nThanks!`;

//   const phone = "917400417731"; // ✅ your whatsapp number
//   const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

//   window.open(url, "_blank", "noopener,noreferrer");
// }


export function openWhatsAppOrder(items) {
  const safe = Array.isArray(items) ? items : [];

  if (!safe.length) {
    alert("Cart is empty!");
    return;
  }

  // ✅ put your real domain here (important so links work on phone)
  const SITE = window.location.origin; 
  // If you want hardcoded:
  // const SITE = "https://begorgeous.vercel.app";

  const lines = safe.map((x) => {
    const name = x.name ?? x.title ?? "Item";
    const qty = Number(x.qty ?? 1);
    const price = Number(x.price ?? x.mrp ?? 0);
    const lineTotal = qty * price;

    // ✅ product page link
    const productLink = x.slug
      ? `${SITE}/product/${x.slug}`
      : `${SITE}/product/${x.id}`;

    // ✅ image link (must be public URL to open on WhatsApp)
    const imgUrl = x.image || x.img || x.img1 || "";

    return (
      `• ${name} × ${qty} — ₹${lineTotal}\n` +
      `  Link: ${productLink}\n` +
      (imgUrl ? `  Image: ${imgUrl}` : `  Image: (not available)`)
    );
  });

  const total = safe.reduce((sum, x) => {
    const qty = Number(x.qty ?? 1);
    const price = Number(x.price ?? x.mrp ?? 0);
    return sum + qty * price;
  }, 0);

  const msg =
    `Hi, I want to order:\n\n` +
    lines.join("\n\n") +
    `\n\nTotal: ₹${total}\n\nThanks!`;

  const phone = "917400417731";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

  window.open(url, "_blank", "noopener,noreferrer");
}
