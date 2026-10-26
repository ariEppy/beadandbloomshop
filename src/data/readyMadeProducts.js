import blueSunNecklace from "../assets/photos/blue-sun-necklace-flat.jpeg";
import tigerEyeStarfishNecklace from "../assets/photos/tiger-eye-starfish-necklace.jpeg";
import gardenMixNecklace from "../assets/photos/garden-mix-necklace.jpeg";
import blueBlushNecklace from "../assets/photos/blue-blush-necklace.jpeg";
import pinkLemonadeNecklace from "../assets/photos/pink-lemonade-necklace.jpeg";

// Ready-made pieces shown in the shop.
//
// To add a piece: put its photo in src/assets/photos/, import it at the top of
// this file, and add an entry below. Set `available: false` once a piece is
// sold so it shows as "Sold out" instead of disappearing.
//
// category must be one of: "necklace", "braceletAnklet", "earrings"
//
// imagePosition (optional): which part of the photo to keep when it's cropped
// to the tall shop card, as a CSS object-position, e.g. "85% 50%" keeps the
// right-hand side. Defaults to the center.

const READY_MADE_PRODUCTS = [
  {
    id: "blue-sun-necklace",
    name: "Blue Sun Necklace",
    category: "necklace",
    price: 120,
    image: blueSunNecklace,
    description:
      "Dusky blue rondelle beads with gold spacers and a gold sun pendant. All metal components are stainless steel. Adjustable length: 16–18 inches.",
    available: true,
  },
  {
    id: "tiger-eye-starfish-necklace",
    name: "Tiger Eye Starfish Necklace",
    category: "necklace",
    price: 120,
    image: tigerEyeStarfishNecklace,
    description:
      "Round tiger eye beads in warm browns and gold, finished with a gold starfish pendant.",
    available: true,
  },
  {
    id: "garden-mix-necklace",
    name: "Garden Mix Necklace",
    category: "necklace",
    price: 100,
    image: gardenMixNecklace,
    description:
      "Green glass and tiger eye beads mixed with soft pink, frosted crystal and matte mauve spacers.",
    available: true,
  },
  {
    id: "blue-blush-necklace",
    name: "Blue & Blush Necklace",
    category: "necklace",
    price: 80,
    image: blueBlushNecklace,
    description:
      "Sky blue rondelles with small deep green beads and pale pink crystals.",
    available: true,
  },
  {
    id: "pink-lemonade-necklace",
    name: "Pink Lemonade Necklace",
    category: "necklace",
    price: 80,
    image: pinkLemonadeNecklace,
    description:
      "Candy pink rondelles with deep red beads and mustard yellow crystals.",
    available: true,
  },
];

export const CATEGORY_LABELS = {
  necklace: "Necklaces",
  braceletAnklet: "Bracelets & Anklets",
  earrings: "Earrings",
};

export default READY_MADE_PRODUCTS;
