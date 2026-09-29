const u = (id: string, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

export const CATEGORIES = [
  { slug: "weddings", name: "Weddings", img: u("photo-1519741497674-611481863552") },
  { slug: "events", name: "Events", img: u("photo-1540575467063-178a50c2df87") },
  { slug: "portraits", name: "Portraits", img: u("photo-1554048612-b6a482bc67e5") },
  { slug: "family", name: "Family", img: u("photo-1511895426328-dc8714191300") },
  { slug: "graduation", name: "Graduation", img: u("photo-1523050854058-8df90110c9f1") },
  { slug: "corporate", name: "Corporate", img: u("photo-1500648767791-00dcc994a43e") },
  { slug: "fashion", name: "Fashion", img: u("photo-1509631179647-0177331693ae") },
  { slug: "product", name: "Product", img: u("photo-1523275335684-37898b6baf30") },
  { slug: "real-estate", name: "Real estate", img: u("photo-1600596542815-ffad4c1539a9") },
  { slug: "sports", name: "Sports", img: u("photo-1461896836934-ffe607ba8211") },
  { slug: "maternity", name: "Maternity", img: u("photo-1494790108377-be9c29b29330") },
  { slug: "birthday", name: "Birthday parties", img: u("photo-1530103862676-de8c9debad1d") },
  { slug: "couples", name: "Couples", img: u("photo-1516589178581-6cd7833ae3b2") },
  { slug: "school", name: "School", img: u("photo-1523050854058-8df90110c9f1") },
  { slug: "other", name: "Other", img: u("photo-1492691527719-9d1e07e534b4") },
] as const;

export type TrustBadge = "Verified Photographer" | "ID Verified" | "Portfolio Verified" | "Business Verified" | "Top Rated" | "Experienced" | "Fast Responder";

export type Photographer = {
  id: string; name: string; business: string; avatar: string; city: string; distanceKm: number;
  categories: string[]; about: string; priceFrom: number; rating: number; reviews: number;
  completed: number; responseMins: number; badges: TrustBadge[]; promoted: boolean;
  availableDays: number[]; profileQuality: number; joined: string; portfolio: string[];
  packages: { name: string; price: number; hours: number; desc: string }[];
  reviewList: { name: string; rating: number; text: string; date: string }[];
};

const G = {
  wed: ["photo-1519741497674-611481863552", "photo-1511285560929-80b456fea0bc", "photo-1516589178581-6cd7833ae3b2"],
  por: ["photo-1554048612-b6a482bc67e5", "photo-1438761681033-6461ffad8d80", "photo-1494790108377-be9c29b29330"],
  evt: ["photo-1540575467063-178a50c2df87", "photo-1530103862676-de8c9debad1d", "photo-1523050854058-8df90110c9f1"],
  com: ["photo-1523275335684-37898b6baf30", "photo-1600596542815-ffad4c1539a9", "photo-1509631179647-0177331693ae"],
  fam: ["photo-1511895426328-dc8714191300", "photo-1461896836934-ffe607ba8211", "photo-1492691527719-9d1e07e534b4"],
};
const pf = (ids: string[]) => ids.map((i) => u(i, 1200));
const pk = (b: number) => [
  { name: "Essential", price: b, hours: 1, desc: "1 hour session · 25 edited images" },
  { name: "Signature", price: Math.round(b * 2.2), hours: 3, desc: "3 hours · 80 edited images · online gallery" },
  { name: "Full day", price: Math.round(b * 4.5), hours: 8, desc: "Full coverage · 300+ images · second shooter" },
];
const rv = [
  { name: "Thandi M.", rating: 5, text: "Captured every moment beautifully. Delivered ahead of schedule!", date: "Aug 2026" },
  { name: "James K.", rating: 5, text: "Professional, relaxed and incredibly talented.", date: "Jul 2026" },
  { name: "Aisha P.", rating: 4, text: "Lovely photos and great communication throughout.", date: "Jun 2026" },
];

const raw: Omit<Photographer, "packages" | "reviewList">[] = [
  { id: "lerato-studio", name: "Lerato Dlamini", business: "Lerato Studio", avatar: u("photo-1438761681033-6461ffad8d80", 200), city: "Johannesburg", distanceKm: 4, categories: ["weddings", "couples", "portraits"], about: "Documentary-style wedding and couples photographer chasing golden light across Gauteng for 9 years.", priceFrom: 1500, rating: 4.9, reviews: 214, completed: 320, responseMins: 20, badges: ["Verified Photographer", "ID Verified", "Top Rated", "Experienced", "Fast Responder"], promoted: false, availableDays: [5, 6, 0], profileQuality: 0.95, joined: "2019", portfolio: pf(G.wed) },
  { id: "sipho-frames", name: "Sipho Nkosi", business: "Frames by Sipho", avatar: u("photo-1507003211169-0a1dd7228f2d", 200), city: "Johannesburg", distanceKm: 9, categories: ["events", "corporate", "birthday"], about: "Event and corporate specialist. Fast turnaround, sharp storytelling.", priceFrom: 1000, rating: 4.7, reviews: 98, completed: 140, responseMins: 45, badges: ["ID Verified", "Business Verified"], promoted: true, availableDays: [1, 2, 3, 4, 5, 6], profileQuality: 0.8, joined: "2022", portfolio: pf(G.evt) },
  { id: "amara-light", name: "Amara Okafor", business: "Amara Light", avatar: u("photo-1494790108377-be9c29b29330", 200), city: "Cape Town", distanceKm: 3, categories: ["portraits", "fashion", "maternity"], about: "Editorial portraits and fashion with a soft, cinematic palette.", priceFrom: 1200, rating: 4.95, reviews: 176, completed: 210, responseMins: 15, badges: ["Verified Photographer", "Portfolio Verified", "Top Rated", "Fast Responder"], promoted: true, availableDays: [2, 3, 4, 6], profileQuality: 0.97, joined: "2020", portfolio: pf(G.por) },
  { id: "pixel-works", name: "Daniel van Wyk", business: "Pixel Works", avatar: u("photo-1500648767791-00dcc994a43e", 200), city: "Cape Town", distanceKm: 12, categories: ["product", "real-estate", "corporate"], about: "Commercial product and property photography. Studio and on-location.", priceFrom: 900, rating: 4.6, reviews: 61, completed: 88, responseMins: 90, badges: ["Business Verified"], promoted: false, availableDays: [1, 2, 3, 4, 5], profileQuality: 0.75, joined: "2023", portfolio: pf(G.com) },
  { id: "naledi-family", name: "Naledi Mokoena", business: "Little Moments", avatar: u("photo-1554048612-b6a482bc67e5", 200), city: "Durban", distanceKm: 6, categories: ["family", "maternity", "school", "graduation"], about: "Warm, natural family photography — newborns to graduations.", priceFrom: 800, rating: 4.8, reviews: 132, completed: 190, responseMins: 30, badges: ["Verified Photographer", "ID Verified", "Experienced"], promoted: false, availableDays: [0, 6], profileQuality: 0.88, joined: "2021", portfolio: pf(G.fam) },
  { id: "kai-sports", name: "Kai Pillay", business: "Kai Motion", avatar: u("photo-1507003211169-0a1dd7228f2d", 200), city: "Durban", distanceKm: 15, categories: ["sports", "events", "other"], about: "High-speed sports and action photography.", priceFrom: 1100, rating: 4.5, reviews: 24, completed: 30, responseMins: 120, badges: [], promoted: true, availableDays: [3, 4, 5, 6, 0], profileQuality: 0.65, joined: "2026", portfolio: pf([G.fam[1], G.evt[0], G.com[2]]) },
];

export const PHOTOGRAPHERS: Photographer[] = raw.map((p) => ({ ...p, packages: pk(p.priceFrom), reviewList: rv }));
export const getPhotographer = (id: string) => PHOTOGRAPHERS.find((p) => p.id === id);
export const catName = (s: string) => CATEGORIES.find((c) => c.slug === s)?.name ?? s;

/* ---------- Fees ---------- */
export const SERVICE_FEE = 15;
export const COMMISSION_RATE = 0.1;
export const PROMOTED_PRICE = 100;
export function calcFees(price: number) {
  const commission = Math.round(price * COMMISSION_RATE * 100) / 100;
  return { price, serviceFee: SERVICE_FEE, clientPays: price + SERVICE_FEE, commission, photographerReceives: price - commission };
}
export const zar = (n: number) => "R" + n.toLocaleString("en-ZA", { maximumFractionDigits: 2 });

/* ---------- Search ranking ---------- */
export type Filters = { q?: string; city?: string; category?: string; maxPrice?: number; minRating?: number; day?: number; maxDistance?: number; verifiedOnly?: boolean; promotedOnly?: boolean };
export const isVerified = (p: Photographer) => p.badges.some((b) => b.includes("Verified"));

export function searchPhotographers(f: Filters) {
  const q = f.q?.toLowerCase().trim();
  // Hard filters first: promotion can never override relevance or rules.
  const matches = PHOTOGRAPHERS.filter((p) =>
    (!f.city || p.city.toLowerCase().includes(f.city.toLowerCase())) &&
    (!f.category || p.categories.includes(f.category)) &&
    (!f.maxPrice || p.priceFrom <= f.maxPrice) &&
    (!f.minRating || p.rating >= f.minRating) &&
    (f.day === undefined || p.availableDays.includes(f.day)) &&
    (!f.maxDistance || p.distanceKm <= f.maxDistance) &&
    (!f.verifiedOnly || isVerified(p)) &&
    (!f.promotedOnly || p.promoted) &&
    (!q || [p.name, p.business, p.about, ...p.categories.map(catName)].join(" ").toLowerCase().includes(q)));
  const score = (p: Photographer) => {
    const relevance = f.category ? (p.categories[0] === f.category ? 1 : 0.8) : 0.9;
    return relevance * 0.25 + (1 - Math.min(p.distanceKm, 30) / 30) * 0.18 + (p.availableDays.length / 7) * 0.1 +
      (p.rating / 5) * Math.min(1, p.reviews / 50) * 0.15 + Math.min(1, p.completed / 200) * 0.08 + p.profileQuality * 0.07 +
      (1 - Math.min(p.responseMins, 180) / 180) * 0.05 + Math.min(1, p.badges.length / 4) * 0.05 + (p.promoted ? 0.07 : 0);
  };
  return matches.map((p) => ({ p, s: score(p) })).sort((a, b) => b.s - a.s).map((x) => x.p);
}

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
