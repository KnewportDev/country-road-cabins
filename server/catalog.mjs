// Verified accommodation facts. See docs/research.md for page-level sources.
export const bookingUrl =
  "https://guest.rezstream.com/search/country-road-cabins";
export const stays = [
  {
    id: "holly-rock",
    name: "Holly Rock Treehouse",
    category: "treehouses",
    label: "In the treetops",
    guests: 2,
    image: "holly-rock.webp",
    alt: "Holly Rock Treehouse nestled among green trees",
    description:
      "Cross a canopy bridge to your own little world, built around a living oak.",
    amenities: [
      "Queen bed",
      "Private hot tub",
      "Wraparound deck",
      "Kitchenette",
    ],
    url: "https://wvcabins.com/accommodation/holly-rock-treehouse/",
  },
  {
    id: "valley-view",
    name: "Valley View",
    category: "cabins",
    label: "A classic cabin stay",
    guests: 6,
    image: "valley-view.webp",
    alt: "Valley View log cabin and porch surrounded by forest",
    description:
      "Two bedrooms, a crackling gas fireplace, and room to settle in together.",
    amenities: ["2 bedrooms", "2 bathrooms", "Full kitchen", "Private hot tub"],
    url: "https://wvcabins.com/accommodation/valley-view/",
  },
  {
    id: "safari-sun",
    name: "Safari Sun",
    category: "glamping",
    label: "A softer side of camping",
    guests: 3,
    image: "safari-sun.webp",
    alt: "Safari Sun canvas tent with a furnished wooden deck",
    description:
      "Canvas overhead, forest all around, and the comforts that make it a vacation.",
    amenities: [
      "King bed",
      "Private bathroom",
      "Kitchenette",
      "Private hot tub",
    ],
    url: "https://wvcabins.com/accommodation/safari-sun/",
  },
  {
    id: "tuscany",
    name: "Tuscany Treehouse",
    category: "treehouses",
    label: "Among the oaks",
    guests: 4,
    image: "tuscany.webp",
    alt: "Tuscany Treehouse and canopy walkway through leafy woodland",
    description:
      "A canopy bridge, two decks, and a woodland view worth waking up for.",
    amenities: [
      "Queen bed & sleeper sofa",
      "Private hot tub",
      "Kitchenette",
      "Wi-Fi",
    ],
    url: "https://wvcabins.com/accommodation/tuscany-tree-house/",
  },
  {
    id: "love-shack",
    name: "Love Shack Yurt",
    category: "yurts",
    label: "Just the two of you",
    guests: 2,
    image: "love-shack.webp",
    alt: "Love Shack wooden yurt and raised deck in the woods",
    description:
      "A tucked-away wooden yurt with a skylight and a heart-shaped soaking tub.",
    amenities: ["Sleeps 2", "Full kitchen", "Private hot tub", "Pet friendly"],
    url: "https://wvcabins.com/accommodation/love-shack-yurt/",
  },
  {
    id: "moonshiner",
    name: "Moonshiner",
    category: "glamping",
    label: "A different perspective",
    guests: 4,
    image: "dome-hero.webp",
    alt: "Moonshiner geodesic dome interior with a wood accent wall and bed",
    description:
      "A geodesic dome brings a different shape to a getaway in the trees.",
    amenities: [
      "King bed & queen loft",
      "Private hot tub",
      "Full kitchen",
      "Fire pit",
    ],
    url: "https://wvcabins.com/accommodation/moonshiner/",
  },
];

export const categories = ["all", "cabins", "treehouses", "yurts", "glamping"];

export function queryStays(searchParams) {
  const category = searchParams.get("category") || "all";
  const rawGuests = searchParams.get("guests") || "0";
  if (!categories.includes(category))
    return { status: 400, body: { error: "Choose a valid stay category." } };
  if (!/^(0|[1-9]|1[0-4])$/.test(rawGuests))
    return {
      status: 400,
      body: { error: "Guests must be a whole number from 0 to 14." },
    };
  const guests = Number(rawGuests);
  const items = stays.filter(
    (stay) =>
      (category === "all" || stay.category === category) &&
      stay.guests >= guests,
  );
  return {
    status: 200,
    body: {
      stays: items,
      count: items.length,
      collection: "featured",
      availability: "not-live",
      bookingUrl,
    },
  };
}
