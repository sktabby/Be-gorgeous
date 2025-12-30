export function openWhatsAppOrder(items) {
  const safe = Array.isArray(items) ? items : [];

  if (!safe.length) {
    alert("Cart is empty!");
    return;
  }

  const lines = safe.map((x) => {
    const name = x.name ?? x.title ?? "Item";
    const qty = Number(x.qty ?? 1);
    const price = Number(x.price ?? x.mrp ?? 0);
    const lineTotal = qty * price;

    return `• ${name} × ${qty} — ₹${lineTotal}`;
  });

  const total = safe.reduce((sum, x) => {
    const qty = Number(x.qty ?? 1);
    const price = Number(x.price ?? x.mrp ?? 0);
    return sum + qty * price;
  }, 0);

  const msg =
    `Hi, I want to order:\n\n` +
    lines.join("\n") +
    `\n\nTotal: ₹${total}\n\nThanks!`;

  const phone = "917400417731"; // ✅ your whatsapp number
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

  window.open(url, "_blank", "noopener,noreferrer");
}
