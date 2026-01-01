export function openWhatsAppOrder(items) {
  const safe = Array.isArray(items) ? items : [];

  if (!safe.length) {
    alert("Cart is empty!");
    return;
  }

  // ✅ This automatically becomes your live domain after deployment
  // localhost => http://localhost:5173
  // live => https://yourdomain.com
  const SITE = window.location.origin;

  const total = safe.reduce((sum, x) => {
    const qty = Number(x.qty ?? 1);
    const price = Number(x.price ?? x.mrp ?? 0);
    return sum + qty * price;
  }, 0);

  const itemCount = safe.reduce((a, b) => a + Number(b.qty ?? 1), 0);

  const lines = safe.map((x, i) => {
    const name = x.name ?? x.title ?? "Item";
    const qty = Number(x.qty ?? 1);
    const price = Number(x.price ?? x.mrp ?? 0);
    const lineTotal = qty * price;

    const productLink = x.slug
      ? `${SITE}/product/${x.slug}`
      : `${SITE}/product/${x.id}`;

    const imgUrl = x.image || x.img || x.img1 || "";

    return (
      `*${i + 1}. ${name}*\n` +
      `Qty: ${qty}\n` +
      `Price: ₹${price}\n` +
      `Subtotal: ₹${lineTotal}\n` +
      `Link: ${productLink}\n` +
      `Image: ${imgUrl || "(not available)"}`
    );
  });

  const msg =
    `✨ *New Order Request* ✨\n` +
    `----------------------------\n` +
    `Items: *${itemCount}*\n` +
    `Total: *₹${total}*\n` +
    `----------------------------\n\n` +
    lines.join("\n\n----------------------------\n\n") +
    `\n\n✅ Please confirm availability & delivery details.\n` +
    `Thank you!`;

  const phone = "918369775050";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

  window.open(url, "_blank", "noopener,noreferrer");
}
