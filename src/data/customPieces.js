// The kinds of custom pieces customers can design, with their prices.

const CUSTOM_PIECES = {
  necklace: {
    label: "Necklace",
    title: "Custom Necklace",
    price: 140,
  },
  braceletAnklet: {
    label: "Bracelet / Anklet",
    title: "Custom Bracelet / Anklet",
    price: 100,
  },
  earrings: {
    label: "Earrings",
    title: "Custom Earrings",
    price: 60,
  },
};

// Short one-line description of a custom piece, for the cart.
export function describeCustomPiece(piece) {
  return [
    piece.jewelryType,
    piece.colors.join(", "),
    piece.length,
    piece.earringType,
    piece.charms.length > 0 ? `Charms: ${piece.charms.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join(" · ");
}

// Full description of a custom piece, for the order email.
export function customPieceSummary(piece) {
  const { title, price } = CUSTOM_PIECES[piece.type];
  const lines = [
    title.toUpperCase(),
    `Price: ₪${price} each (${piece.quantity} × ₪${price} = ₪${price * piece.quantity})`,
  ];

  if (piece.type === "braceletAnklet") {
    lines.push(`Type: ${piece.jewelryType || "Not specified"}`);
  }

  lines.push(`Quantity: ${piece.quantity}`);
  lines.push(`Colors: ${piece.colors.join(", ") || "Not specified"}`);

  if (piece.type !== "earrings") {
    lines.push(`Length: ${piece.length || "Not specified"}`);
  }

  lines.push(`Charms: ${piece.charms.join(", ") || "None"}`);

  if (piece.type === "earrings") {
    lines.push(`Earring Style: ${piece.earringType || "Not specified"}`);
  }

  lines.push(`Description: ${piece.description || "No additional description"}`);
  lines.push(`Inspiration Picture: ${piece.inspirationImageUrl || "None uploaded"}`);

  return lines.join("\n");
}

export default CUSTOM_PIECES;
