export function openWhatsAppOrder(items) {
  const lines = items.map(
    (x) => `• ${x.name} × ${x.qty} — ₹${x.price}`
  );

  const msg =
    `Hi, I want to order:\n\n` +
    lines.join("\n") +
    `\n\nThanks!`;

  const phone = "917400417731"; // replace with your WhatsApp number
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}
