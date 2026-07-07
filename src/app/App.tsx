import { useState } from "react";
import {
  Search, MapPin, ArrowRight, Phone, MessageCircle,
  Bed, Menu, X, ChevronLeft, ChevronRight,
  Check, Building2, ChevronDown, SlidersHorizontal,
  Heart, Mail, Calendar, Grid, List,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Page = "home" | "listings" | "detail" | "category" | "contact";
type Status = "Under Development" | "Ready to Move" | "Resale" | "Luxury";

interface Property {
  id: number;
  name: string;
  locality: string;
  price: string;
  priceNum: number;
  status: Status;
  bhk: number;
  area: string;
  image: string;
  builder: string;
  possession: string;
  rera: string;
  description: string;
  amenities: string[];
  floorInfo: string;
  featured?: boolean;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const PROPERTIES: Property[] = [
  {
    id: 1,
    name: "Lodha World Towers",
    locality: "Worli",
    price: "₹18.5 Cr",
    priceNum: 18500000,
    status: "Ready to Move",
    bhk: 4,
    area: "3,450 sq ft",
    image: "https://images.unsplash.com/photo-1776362355123-ca966d36e29c?w=800&h=600&fit=crop&auto=format",
    builder: "Lodha Group",
    possession: "Ready for Possession",
    rera: "P51900007778",
    description: "An iconic address on Worli Seaface offering panoramic Arabian Sea views, world-class concierge services, and interiors crafted by internationally acclaimed designers. Every detail here speaks of effortless elegance.",
    amenities: ["Infinity Pool", "Concierge Service", "Private Gymnasium", "Helipad", "Spa & Salon", "Home Theatre", "Children's Play Area", "Valet Parking"],
    floorInfo: "42nd Floor — Tower A",
    featured: true,
  },
  {
    id: 2,
    name: "Raheja Vivarea",
    locality: "Mahalaxmi",
    price: "₹12.2 Cr",
    priceNum: 12200000,
    status: "Ready to Move",
    bhk: 3,
    area: "2,200 sq ft",
    image: "https://images.unsplash.com/photo-1780257562963-3389a4105371?w=800&h=600&fit=crop&auto=format",
    builder: "Raheja Universal",
    possession: "Ready for Possession",
    rera: "P51900012345",
    description: "Designed for those who seek quiet luxury. Located in the serene heart of Mahalaxmi with sweeping racecourse and sea views. A retreat from the city's pace, without sacrificing its privileges.",
    amenities: ["Swimming Pool", "Club House", "Gymnasium", "Landscaped Gardens", "Multipurpose Hall", "Indoor Games Room"],
    floorInfo: "28th Floor — Tower B",
    featured: true,
  },
  {
    id: 3,
    name: "Oberoi Elysian",
    locality: "Worli",
    price: "₹22 Cr",
    priceNum: 22000000,
    status: "Under Development",
    bhk: 4,
    area: "4,100 sq ft",
    image: "https://images.unsplash.com/photo-1750758606030-3b200b20b963?w=800&h=600&fit=crop&auto=format",
    builder: "Oberoi Realty",
    possession: "Dec 2026",
    rera: "P51900019876",
    description: "A landmark development redefining luxury living in Worli with triple-height lobbies, double-height living spaces, and an uninterrupted sea horizon stretching to the edge of the sky.",
    amenities: ["Sky Lounge", "Private Terrace", "Smart Home Automation", "Valet Parking", "Wine Cellar", "Cigar Lounge", "Business Centre"],
    floorInfo: "55th Floor — Main Tower",
    featured: true,
  },
  {
    id: 4,
    name: "The Address, Cuffe Parade",
    locality: "Cuffe Parade",
    price: "₹16.8 Cr",
    priceNum: 16800000,
    status: "Resale",
    bhk: 4,
    area: "3,800 sq ft",
    image: "https://images.unsplash.com/photo-1679249010086-b8a932c8cafc?w=800&h=600&fit=crop&auto=format",
    builder: "Private Seller",
    possession: "Ready for Possession",
    rera: "P51900023411",
    description: "A prestigious resale offering in Cuffe Parade's most sought-after tower. Sweeping Back Bay views from every principal room. This home has been maintained to show-ready standard throughout.",
    amenities: ["Sea View", "Private Club", "Concierge", "Pool", "Squash Court", "Library Lounge"],
    floorInfo: "18th Floor — Ocean Tower",
  },
  {
    id: 5,
    name: "Malabar Heights Penthouse",
    locality: "Malabar Hill",
    price: "₹35 Cr",
    priceNum: 35000000,
    status: "Luxury",
    bhk: 5,
    area: "6,500 sq ft",
    image: "https://images.unsplash.com/photo-1758193431355-54df41421657?w=800&h=600&fit=crop&auto=format",
    builder: "K Raheja Corp",
    possession: "Ready for Possession",
    rera: "P51900031245",
    description: "An ultra-rare duplex penthouse atop Malabar Hill with 360° views across Marine Drive, the Arabian Sea, and the city skyline at sunset. One of fewer than a dozen homes of this calibre in all of South Mumbai.",
    amenities: ["Private Terrace 2,000 sq ft", "Plunge Pool", "Staff Quarters", "4-Car Parking", "Full Home Automation", "Private Lift"],
    floorInfo: "Top Floor Duplex — Floors 31 & 32",
    featured: true,
  },
  {
    id: 6,
    name: "Roha Ahimsa",
    locality: "Breach Candy",
    price: "₹9.5 Cr",
    priceNum: 9500000,
    status: "Under Development",
    bhk: 3,
    area: "1,980 sq ft",
    image: "https://images.unsplash.com/photo-1708064931211-62825371b683?w=800&h=600&fit=crop&auto=format",
    builder: "Roha Realty",
    possession: "Mar 2027",
    rera: "P51900044521",
    description: "A green-certified development in Breach Candy featuring terraced gardens, EV charging bays, and a wellness-first lifestyle. Certification pending from IGBC for Platinum rating.",
    amenities: ["Rooftop Garden", "EV Charging Bays", "Yoga Deck", "Pool", "Crèche", "Co-working Lounge"],
    floorInfo: "Available on Floors 12–36",
  },
  {
    id: 7,
    name: "Walkeshwar Manor",
    locality: "Walkeshwar",
    price: "₹14.5 Cr",
    priceNum: 14500000,
    status: "Resale",
    bhk: 4,
    area: "2,900 sq ft",
    image: "https://images.unsplash.com/photo-1780257562941-d9a6923befa1?w=800&h=600&fit=crop&auto=format",
    builder: "Private Seller",
    possession: "Ready for Possession",
    rera: "P51900055678",
    description: "A heritage bungalow-converted residence in the storied Walkeshwar precinct. Old-world character — soaring ceilings, original mosaic floors — meets carefully updated contemporary finishes.",
    amenities: ["Heritage Property", "Private Garden", "Covered Parking", "Staff Room", "High Ceilings", "Mosaic Floors"],
    floorInfo: "Ground + First Floor",
  },
  {
    id: 8,
    name: "Tardeo Supreme",
    locality: "Tardeo",
    price: "₹7.8 Cr",
    priceNum: 7800000,
    status: "Under Development",
    bhk: 2,
    area: "1,450 sq ft",
    image: "https://images.unsplash.com/photo-1681039580747-569f9cd54858?w=800&h=600&fit=crop&auto=format",
    builder: "Rustomjee",
    possession: "Jun 2026",
    rera: "P51900061123",
    description: "Smart 2BHK residences in Tardeo's most central address, designed for the discerning professional. Steps from Haji Ali. Efficient layouts, generous fenestration, and thoughtful shared amenity spaces.",
    amenities: ["Sky Deck", "Co-working Space", "Gym", "Pool", "EV Charging", "Concierge"],
    floorInfo: "Available on Floors 8–28",
  },
];

const NEIGHBORHOODS = [
  { name: "Worli", tagline: "Sea-facing skyline", count: 28, image: "https://images.unsplash.com/photo-1679249010086-b8a932c8cafc?w=600&h=800&fit=crop&auto=format" },
  { name: "Malabar Hill", tagline: "Legacy addresses", count: 14, image: "https://images.unsplash.com/photo-1750758605895-34f909ca82ce?w=600&h=800&fit=crop&auto=format" },
  { name: "Cuffe Parade", tagline: "The original prestige", count: 19, image: "https://images.unsplash.com/photo-1710582308582-55cc0c461c4e?w=600&h=800&fit=crop&auto=format" },
  { name: "Breach Candy", tagline: "Quiet exclusivity", count: 11, image: "https://images.unsplash.com/photo-1750758606030-3b200b20b963?w=600&h=800&fit=crop&auto=format" },
];

const CATEGORIES = [
  { id: "under-development", label: "Under Development", count: 32, description: "Early-access pricing on tomorrow's finest addresses" },
  { id: "ready-to-move", label: "Ready to Move", count: 18, description: "Move in immediately — no waiting, no uncertainty" },
  { id: "resale", label: "Resale", count: 27, description: "Pre-owned homes with established character and location" },
  { id: "luxury", label: "Luxury & Ultra-Luxury", count: 9, description: "South Mumbai's most exceptional residences, curated" },
];

const TESTIMONIALS = [
  { name: "Arjun & Priya Mehta", locality: "Worli", quote: "Parmar Properties found us a home we didn't know existed. Their knowledge of South Mumbai's micro-markets is genuinely unparalleled — no portal comes close.", rating: 5 },
  { name: "Cyrus Patel", locality: "Malabar Hill", quote: "I've dealt with three brokerages over the years. Parmar is the only one that feels like a private concierge, not a listing portal. Completely different experience.", rating: 5 },
  { name: "Sheila Rodrigues", locality: "Cuffe Parade", quote: "From shortlisting through RERA registration, every detail was managed with real care. They turned what I dreaded into an actual pleasure.", rating: 5 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const toggle = <T,>(arr: T[], val: T): T[] =>
  arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

const STATUS_COLOR: Record<Status, string> = {
  "Under Development": "bg-emerald-900 text-emerald-100",
  "Ready to Move": "bg-sky-800 text-sky-50",
  "Resale": "bg-amber-800 text-amber-50",
  "Luxury": "bg-[#1A1A18] text-[#C3A55E]",
};

// ─── StatusBadge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-block px-2.5 py-[3px] text-[10px] tracking-widest uppercase font-sans font-semibold ${STATUS_COLOR[status]}`}>
      {status}
    </span>
  );
}

// ─── PropertyCard ─────────────────────────────────────────────────────────────

function PropertyCard({ property, onClick }: { property: Property; onClick: () => void }) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="bg-card group cursor-pointer overflow-hidden border border-border hover:border-primary/40 transition-colors duration-300" onClick={onClick}>
      <div className="relative overflow-hidden h-56 bg-muted">
        <img src={property.image} alt={property.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3"><StatusBadge status={property.status} /></div>
        <button
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
          onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
        >
          <Heart size={14} fill={saved ? "currentColor" : "none"} className={saved ? "text-red-500" : "text-foreground"} />
        </button>
        <div className="absolute bottom-3 left-3">
          <span className="text-white font-serif text-xl font-medium drop-shadow">{property.price}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-base font-medium text-foreground leading-snug">{property.name}</h3>
        <div className="flex items-center gap-1 mt-1 text-muted-foreground text-xs">
          <MapPin size={11} />
          <span>{property.locality}, South Mumbai</span>
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Bed size={11} />{property.bhk} BHK</span>
          <span>{property.area}</span>
          {property.possession !== "Ready for Possession" && (
            <span className="ml-auto text-primary text-[11px] font-medium font-sans">Pos: {property.possession}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar({ current, navigate }: { current: Page; navigate: (p: Page) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-background/97 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <button onClick={() => navigate("home")} className="flex flex-col leading-none group">
          <span className="font-serif text-[17px] font-medium tracking-tight text-foreground">PARMAR</span>
          <span className="text-[8px] tracking-[0.3em] uppercase text-muted-foreground font-sans">Properties · Est. 1994</span>
        </button>

        <nav className="hidden md:flex items-center gap-8 text-sm text-foreground">
          {([["listings", "Listings"], ["category", "Under Development"], ["contact", "Contact"]] as [Page, string][]).map(([p, label]) => (
            <button key={p} onClick={() => navigate(p)} className={`hover:text-primary transition-colors font-sans ${current === p ? "text-primary font-medium" : ""}`}>
              {label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a href="tel:+919820000000" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 font-sans">
            <Phone size={13} /> +91 98200 00000
          </a>
          <button
            onClick={() => navigate("contact")}
            className="bg-primary text-primary-foreground text-sm px-5 py-2 hover:bg-primary/90 transition-colors font-sans font-medium tracking-wide"
          >
            Enquire Now
          </button>
        </div>

        <button className="md:hidden p-1" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-t border-border px-5 py-5 flex flex-col gap-5 text-sm font-sans">
          {([["home", "Home"], ["listings", "Listings"], ["category", "Under Development"], ["contact", "Contact"]] as [Page, string][]).map(([p, label]) => (
            <button key={p} onClick={() => { navigate(p); setOpen(false); }} className="text-left hover:text-primary transition-colors">
              {label}
            </button>
          ))}
          <button onClick={() => { navigate("contact"); setOpen(false); }} className="bg-primary text-primary-foreground px-4 py-3 font-medium mt-1">
            Enquire Now
          </button>
        </div>
      )}
    </header>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <div className="font-serif text-xl font-medium tracking-tight mb-0.5">PARMAR</div>
            <div className="text-[8px] tracking-[0.3em] uppercase text-background/40 mb-4 font-sans">Properties · Est. 1994</div>
            <p className="text-background/55 text-sm leading-relaxed">South Mumbai's premier real estate consultancy. Curating exceptional homes since 1994.</p>
          </div>
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-background/35 mb-4 font-sans">Browse</h4>
            <ul className="space-y-2.5 text-sm text-background/65">
              {["Under Development", "Ready to Move", "Resale", "Luxury Homes", "Commercial"].map((item) => (
                <li key={item}><button onClick={() => navigate("listings")} className="hover:text-background transition-colors">{item}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-background/35 mb-4 font-sans">Localities</h4>
            <ul className="space-y-2.5 text-sm text-background/65">
              {["Worli", "Malabar Hill", "Cuffe Parade", "Breach Candy", "Tardeo", "Walkeshwar"].map((item) => (
                <li key={item}><button onClick={() => navigate("listings")} className="hover:text-background transition-colors">{item}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-background/35 mb-4 font-sans">Contact</h4>
            <ul className="space-y-3 text-sm text-background/65">
              <li className="flex items-center gap-2.5"><Phone size={13} className="shrink-0" /> +91 98200 00000</li>
              <li className="flex items-center gap-2.5"><MessageCircle size={13} className="shrink-0" /> WhatsApp us anytime</li>
              <li className="flex items-center gap-2.5"><Mail size={13} className="shrink-0" /> hello@parmarproperties.in</li>
              <li className="text-background/40 text-xs leading-relaxed mt-2">Ground Floor, Maker Bhavan No. 1<br />Sir V. T. Marg, New Marine Lines<br />Mumbai 400 020</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background/10 mt-12 pt-6 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between text-xs text-background/35 font-sans">
          <p>© 2025 Parmar Properties Pvt Ltd. All rights reserved. MahaRERA Reg: A51800004579</p>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms", "Disclaimer"].map((l) => <a key={l} href="#" className="hover:text-background/60 transition-colors">{l}</a>)}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── HomePage ─────────────────────────────────────────────────────────────────

function HomePage({ navigate, onSelectProperty }: { navigate: (p: Page) => void; onSelectProperty: (p: Property) => void }) {
  const [loc, setLoc] = useState("");
  const [budget, setBudget] = useState("");
  const [type, setType] = useState("");
  const featured = PROPERTIES.filter((p) => p.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative h-[92vh] min-h-[620px] flex flex-col justify-end bg-[#0D1A13]">
        <img
          src="https://images.unsplash.com/photo-1679249010086-b8a932c8cafc?w=1920&h=1080&fit=crop&auto=format"
          alt="Aerial view of South Mumbai"
          className="absolute inset-0 w-full h-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1A13]/85 via-[#0D1A13]/25 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 pb-14 pt-24 w-full">
          <p className="text-[#C3A55E] text-[10px] tracking-[0.35em] uppercase mb-5 font-sans">South Mumbai — Curated Residences</p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-[72px] text-white leading-[1.04] font-medium mb-8 max-w-2xl">
            Find Your<br />
            <em className="not-italic text-[#C3A55E]">Address</em> in<br />
            South Mumbai
          </h1>

          {/* Search bar */}
          <div className="bg-white/97 backdrop-blur mt-2 max-w-3xl flex flex-col md:flex-row shadow-2xl">
            <div className="flex-1 flex items-center gap-3 px-5 py-3.5 border-b md:border-b-0 md:border-r border-border">
              <MapPin size={15} className="text-muted-foreground shrink-0" />
              <input
                value={loc}
                onChange={(e) => setLoc(e.target.value)}
                placeholder="Locality — Worli, Malabar Hill…"
                className="w-full text-sm bg-transparent text-foreground placeholder:text-muted-foreground outline-none font-sans"
              />
            </div>
            <div className="flex-1 flex items-center gap-3 px-5 py-3.5 border-b md:border-b-0 md:border-r border-border">
              <ChevronDown size={15} className="text-muted-foreground shrink-0" />
              <select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full text-sm bg-transparent text-foreground outline-none cursor-pointer font-sans appearance-none">
                <option value="">Budget Range</option>
                <option>₹5 Cr – ₹10 Cr</option>
                <option>₹10 Cr – ₹20 Cr</option>
                <option>₹20 Cr – ₹50 Cr</option>
                <option>Above ₹50 Cr</option>
              </select>
            </div>
            <div className="flex-1 flex items-center gap-3 px-5 py-3.5 border-b md:border-b-0 md:border-r border-border">
              <ChevronDown size={15} className="text-muted-foreground shrink-0" />
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full text-sm bg-transparent text-foreground outline-none cursor-pointer font-sans appearance-none">
                <option value="">Property Type</option>
                <option>Under Development</option>
                <option>Ready to Move</option>
                <option>Resale</option>
                <option>Luxury</option>
              </select>
            </div>
            <button
              onClick={() => navigate("listings")}
              className="bg-primary text-primary-foreground px-7 py-3.5 font-sans font-medium text-sm tracking-wide hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shrink-0"
            >
              <Search size={14} /> Search
            </button>
          </div>
          <p className="mt-4 text-white/40 text-xs font-sans tracking-wide">180+ curated properties across Worli, Malabar Hill, Cuffe Parade & more</p>
        </div>
      </section>

      {/* Category tiles */}
      <section className="bg-muted">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-16">
          <div className="mb-10">
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2 font-sans">Browse by type</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground font-medium">Every kind of<br />South Mumbai home</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate("category")}
                className="group bg-card border border-border p-6 text-left hover:bg-primary hover:border-primary transition-all duration-300"
              >
                <div className="font-serif text-3xl font-medium mb-0.5 group-hover:text-primary-foreground transition-colors">{cat.count}</div>
                <div className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground group-hover:text-primary-foreground/50 mb-3 font-sans transition-colors">Properties</div>
                <h3 className="font-serif text-sm font-medium mb-2 leading-snug group-hover:text-primary-foreground transition-colors">{cat.label}</h3>
                <p className="text-xs text-muted-foreground group-hover:text-primary-foreground/65 leading-relaxed transition-colors">{cat.description}</p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-primary group-hover:text-primary-foreground/80 transition-all opacity-0 group-hover:opacity-100">
                  Browse <ArrowRight size={11} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured listings — asymmetric */}
      <section className="bg-background py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2 font-sans">Hand-picked for you</p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground font-medium">Featured residences</h2>
            </div>
            <button onClick={() => navigate("listings")} className="hidden md:flex items-center gap-2 text-sm text-primary font-sans font-medium hover:gap-3 transition-all">
              View all listings <ArrowRight size={13} />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Large card */}
            <div
              className="md:col-span-2 relative group cursor-pointer overflow-hidden bg-muted h-[500px]"
              onClick={() => onSelectProperty(featured[0])}
            >
              <img src={featured[0].image} alt={featured[0].name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute top-4 left-4"><StatusBadge status={featured[0].status} /></div>
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <p className="text-white/55 text-[10px] tracking-[0.3em] uppercase mb-1 font-sans">{featured[0].locality}, South Mumbai</p>
                <h3 className="font-serif text-2xl text-white font-medium mb-2">{featured[0].name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[#C3A55E] font-serif text-xl">{featured[0].price}</span>
                  <span className="text-white/55 text-xs font-sans">{featured[0].bhk} BHK · {featured[0].area}</span>
                </div>
              </div>
            </div>

            {/* Stacked cards */}
            <div className="flex flex-col gap-4">
              {featured.slice(1, 3).map((p) => (
                <div
                  key={p.id}
                  className="relative group cursor-pointer overflow-hidden bg-muted flex-1 min-h-[238px]"
                  onClick={() => onSelectProperty(p)}
                >
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3"><StatusBadge status={p.status} /></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white/55 text-[10px] tracking-[0.3em] uppercase mb-0.5 font-sans">{p.locality}</p>
                    <h3 className="font-serif text-base text-white font-medium">{p.name}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[#C3A55E] font-serif">{p.price}</span>
                      <span className="text-white/55 text-[10px] font-sans">{p.bhk} BHK</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Neighborhoods — dark panel */}
      <section className="bg-primary py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-primary-foreground/35 mb-2 font-sans">Explore by location</p>
              <h2 className="font-serif text-3xl md:text-4xl text-primary-foreground font-medium">South Mumbai's<br />finest postcodes</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {NEIGHBORHOODS.map((n) => (
              <button key={n.name} onClick={() => navigate("listings")} className="group relative overflow-hidden h-72 bg-primary-foreground/10">
                <img src={n.image} alt={n.name} className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:opacity-65 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                  <h3 className="font-serif text-xl text-white font-medium">{n.name}</h3>
                  <p className="text-white/55 text-xs mt-0.5 font-sans">{n.tagline}</p>
                  <p className="text-[#C3A55E] text-xs mt-2 font-sans">{n.count} properties</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Why Parmar */}
      <section className="bg-background py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3 font-sans">Why choose us</p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground font-medium leading-snug mb-6">A different kind<br />of real estate partner</h2>
              <p className="text-muted-foreground text-base leading-relaxed mb-8">
                We are not a portal. We are a property consultancy with 30 years of ground-level knowledge in South Mumbai's most sought-after addresses — and we work for you, not for developer commissions.
              </p>
              <div className="space-y-5">
                {[
                  { title: "Hyper-local expertise", desc: "30 years operating exclusively in South Mumbai's premium micro-markets" },
                  { title: "Curated, not aggregated", desc: "Every listing is personally verified and assessed by our team before it appears here" },
                  { title: "End-to-end assistance", desc: "From shortlisting through RERA, legal due diligence, and registration" },
                  { title: "Discreet off-market access", desc: "Our network surfaces homes before they ever appear on any portal" },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-5 h-5 bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={10} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-sans font-semibold text-sm text-foreground mb-0.5">{item.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("contact")}
                className="mt-8 bg-primary text-primary-foreground px-6 py-3 text-sm font-sans font-medium tracking-wide hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
              >
                Talk to a consultant <ArrowRight size={13} />
              </button>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1758193431355-54df41421657?w=800&h=1000&fit=crop&auto=format"
                  alt="Premium South Mumbai building"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary p-7 text-primary-foreground hidden md:block">
                <div className="font-serif text-5xl font-medium">30<span className="text-2xl">+</span></div>
                <div className="text-[9px] tracking-[0.3em] uppercase text-primary-foreground/50 mt-1.5 font-sans leading-relaxed">Years of<br />Expertise</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-12">
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2 font-sans">Client stories</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground font-medium">What our clients say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-card border border-border p-8">
                <div className="flex gap-1 mb-5">
                  {[...Array(t.rating)].map((_, i) => <div key={i} className="w-2.5 h-2.5 bg-[#C3A55E]" />)}
                </div>
                <blockquote className="font-serif text-base text-foreground leading-relaxed mb-6 italic">"{t.quote}"</blockquote>
                <div>
                  <div className="font-sans font-semibold text-sm text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground font-sans">{t.locality}, South Mumbai</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── ListingsPage ─────────────────────────────────────────────────────────────

function ListingsPage({ navigate, onSelectProperty }: { navigate: (p: Page) => void; onSelectProperty: (p: Property) => void }) {
  const [locality, setLocality] = useState<string[]>([]);
  const [status, setStatus] = useState<Status[]>([]);
  const [bhk, setBhk] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("default");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const LOCS = ["Worli", "Malabar Hill", "Cuffe Parade", "Breach Candy", "Tardeo", "Walkeshwar", "Mahalaxmi"];
  const STATUSES: Status[] = ["Under Development", "Ready to Move", "Resale", "Luxury"];
  const BHKS = [2, 3, 4, 5];

  let filtered = PROPERTIES.filter((p) => {
    if (locality.length && !locality.includes(p.locality)) return false;
    if (status.length && !status.includes(p.status)) return false;
    if (bhk.length && !bhk.includes(p.bhk)) return false;
    return true;
  });
  if (sortBy === "price-asc") filtered = [...filtered].sort((a, b) => a.priceNum - b.priceNum);
  if (sortBy === "price-desc") filtered = [...filtered].sort((a, b) => b.priceNum - a.priceNum);

  const FilterPanel = () => (
    <div className="space-y-7">
      <div>
        <h3 className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground mb-3 font-sans">Locality</h3>
        {LOCS.map((l) => (
          <label key={l} className="flex items-center gap-2.5 py-1 cursor-pointer group" onClick={() => setLocality(toggle(locality, l))}>
            <div className={`w-4 h-4 border flex items-center justify-center transition-colors shrink-0 ${locality.includes(l) ? "bg-primary border-primary" : "border-border group-hover:border-primary"}`}>
              {locality.includes(l) && <Check size={10} className="text-primary-foreground" />}
            </div>
            <span className="text-sm text-foreground font-sans">{l}</span>
          </label>
        ))}
      </div>
      <div>
        <h3 className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground mb-3 font-sans">Status</h3>
        {STATUSES.map((s) => (
          <label key={s} className="flex items-center gap-2.5 py-1 cursor-pointer group" onClick={() => setStatus(toggle(status, s))}>
            <div className={`w-4 h-4 border flex items-center justify-center transition-colors shrink-0 ${status.includes(s) ? "bg-primary border-primary" : "border-border group-hover:border-primary"}`}>
              {status.includes(s) && <Check size={10} className="text-primary-foreground" />}
            </div>
            <span className="text-sm text-foreground font-sans">{s}</span>
          </label>
        ))}
      </div>
      <div>
        <h3 className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground mb-3 font-sans">BHK</h3>
        <div className="flex gap-2 flex-wrap">
          {BHKS.map((b) => (
            <button
              key={b}
              onClick={() => setBhk(toggle(bhk, b))}
              className={`px-3 py-1.5 text-sm font-sans border transition-colors ${bhk.includes(b) ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:border-primary"}`}
            >
              {b} BHK
            </button>
          ))}
        </div>
      </div>
      {(locality.length > 0 || status.length > 0 || bhk.length > 0) && (
        <button onClick={() => { setLocality([]); setStatus([]); setBhk([]); }} className="text-xs text-primary hover:underline font-sans">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted border-b border-border">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-10">
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-1 font-sans">Browse</p>
          <h1 className="font-serif text-3xl text-foreground font-medium">All Properties</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowFilters(true)} className="md:hidden flex items-center gap-2 border border-border px-3 py-2 text-sm font-sans hover:border-primary transition-colors">
              <SlidersHorizontal size={13} /> Filters
            </button>
            <span className="text-sm text-muted-foreground font-sans">{filtered.length} properties</span>
          </div>
          <div className="flex items-center gap-3">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm border border-border px-3 py-2 bg-background text-foreground outline-none cursor-pointer hover:border-primary transition-colors font-sans">
              <option value="default">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <div className="flex border border-border">
              <button onClick={() => setView("grid")} className={`p-2 transition-colors ${view === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}><Grid size={14} /></button>
              <button onClick={() => setView("list")} className={`p-2 transition-colors ${view === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}><List size={14} /></button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden md:block w-52 shrink-0 pt-1">
            <FilterPanel />
          </aside>

          {showFilters && (
            <div className="md:hidden fixed inset-0 z-50 bg-background overflow-y-auto p-5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl">Filters</h2>
                <button onClick={() => setShowFilters(false)}><X size={20} /></button>
              </div>
              <FilterPanel />
              <button onClick={() => setShowFilters(false)} className="mt-8 w-full bg-primary text-primary-foreground py-3 font-sans font-medium">
                Show {filtered.length} results
              </button>
            </div>
          )}

          <div className="flex-1 min-w-0">
            {view === "grid" ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((p) => <PropertyCard key={p.id} property={p} onClick={() => onSelectProperty(p)} />)}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((p) => (
                  <div
                    key={p.id}
                    className="bg-card border border-border flex cursor-pointer group hover:border-primary/40 transition-colors overflow-hidden"
                    onClick={() => onSelectProperty(p)}
                  >
                    <div className="w-44 shrink-0 h-36 overflow-hidden bg-muted">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <StatusBadge status={p.status} />
                            <h3 className="font-serif text-base font-medium mt-1.5 leading-snug">{p.name}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 font-sans"><MapPin size={10} />{p.locality}</p>
                          </div>
                          <span className="font-serif text-lg text-foreground font-medium shrink-0">{p.price}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-2 font-sans">{p.description}</p>
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground mt-2 font-sans">
                        <span className="flex items-center gap-1"><Bed size={11} />{p.bhk} BHK</span>
                        <span>{p.area}</span>
                        <span className="ml-auto text-primary font-medium text-[11px]">{p.builder}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {filtered.length === 0 && (
              <div className="py-28 text-center">
                <p className="font-serif text-xl text-muted-foreground">No properties match your filters.</p>
                <button onClick={() => { setLocality([]); setStatus([]); setBhk([]); }} className="mt-4 text-sm text-primary hover:underline font-sans">
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PropertyDetailPage ───────────────────────────────────────────────────────

function PropertyDetailPage({ property, navigate, onSelectProperty }: { property: Property; navigate: (p: Page) => void; onSelectProperty: (p: Property) => void }) {
  const [activeImg, setActiveImg] = useState(0);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const images = [
    property.image,
    "https://images.unsplash.com/photo-1780257562963-3389a4105371?w=800&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1776362355123-ca966d36e29c?w=800&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1758448756350-3d0eec02ba37?w=800&h=600&fit=crop&auto=format",
  ].filter((v, i, a) => a.indexOf(v) === i);

  const related = PROPERTIES.filter((p) => p.id !== property.id).filter((p) => p.locality === property.locality).slice(0, 3);
  const fallback = PROPERTIES.filter((p) => p.id !== property.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted border-b border-border">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-3 flex items-center gap-2 text-xs text-muted-foreground font-sans">
          <button onClick={() => navigate("home")} className="hover:text-primary transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => navigate("listings")} className="hover:text-primary transition-colors">Listings</button>
          <span>/</span>
          <span className="text-foreground">{property.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Gallery */}
            <div>
              <div className="relative overflow-hidden bg-muted h-[420px] md:h-[520px]">
                <img src={images[activeImg]} alt={property.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4"><StatusBadge status={property.status} /></div>
                {images.length > 1 && (
                  <>
                    <button onClick={() => setActiveImg((activeImg - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 w-9 h-9 flex items-center justify-center hover:bg-white transition-colors">
                      <ChevronLeft size={16} />
                    </button>
                    <button onClick={() => setActiveImg((activeImg + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 w-9 h-9 flex items-center justify-center hover:bg-white transition-colors">
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}
              </div>
              <div className="flex gap-2 mt-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`h-16 w-20 shrink-0 overflow-hidden bg-muted border-2 transition-colors ${i === activeImg ? "border-primary" : "border-transparent hover:border-border"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Price & heading */}
            <div className="border-b border-border pb-8">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-1 font-sans">{property.locality}, South Mumbai</p>
                  <h1 className="font-serif text-3xl md:text-4xl text-foreground font-medium">{property.name}</h1>
                  <p className="text-sm text-muted-foreground mt-1.5 font-sans">{property.floorInfo}</p>
                </div>
                <div className="text-right">
                  <div className="font-serif text-3xl text-primary font-medium">{property.price}</div>
                  <div className="text-xs text-muted-foreground mt-1 font-sans">All-inclusive</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-7">
                {[
                  { icon: <Bed size={18} />, label: "Configuration", value: `${property.bhk} Bedroom` },
                  { icon: <Building2 size={18} />, label: "Carpet Area", value: property.area },
                  { icon: <Calendar size={18} />, label: "Possession", value: property.possession },
                ].map((item) => (
                  <div key={item.label} className="bg-muted p-4 text-center">
                    <div className="flex justify-center text-primary mb-2">{item.icon}</div>
                    <div className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground font-sans">{item.label}</div>
                    <div className="font-serif text-sm font-medium mt-0.5">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="border-b border-border pb-8">
              <h2 className="font-serif text-xl font-medium mb-4">About this property</h2>
              <p className="text-muted-foreground leading-relaxed font-sans">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="border-b border-border pb-8">
              <h2 className="font-serif text-xl font-medium mb-5">Amenities & features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-2.5 text-sm text-foreground font-sans">
                    <div className="w-4 h-4 bg-primary/10 flex items-center justify-center shrink-0">
                      <Check size={10} className="text-primary" />
                    </div>
                    {a}
                  </div>
                ))}
              </div>
            </div>

            {/* Project details */}
            <div className="pb-4">
              <h2 className="font-serif text-xl font-medium mb-5">Project details</h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {[
                  { label: "Builder / Seller", value: property.builder },
                  { label: "MahaRERA No.", value: property.rera },
                  { label: "Possession", value: property.possession },
                  { label: "Configuration", value: `${property.bhk} BHK` },
                ].map((row) => (
                  <div key={row.label} className="border-b border-border pb-3">
                    <div className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground font-sans mb-1">{row.label}</div>
                    <div className="font-medium text-foreground text-sm font-sans">{row.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enquiry sidebar */}
          <div>
            <div className="border border-border p-6 sticky top-24">
              <h3 className="font-serif text-xl font-medium mb-1">Enquire about<br />this property</h3>
              <p className="text-xs text-muted-foreground mb-5 font-sans">Our consultant calls within 2 business hours</p>

              {submitted ? (
                <div className="py-10 text-center">
                  <div className="w-10 h-10 bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Check size={20} className="text-primary" />
                  </div>
                  <p className="font-serif text-base font-medium">Thank you, {form.name}!</p>
                  <p className="text-xs text-muted-foreground mt-1 font-sans">We will be in touch shortly.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-3">
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="w-full border border-border px-3 py-2.5 text-sm bg-background outline-none focus:border-primary transition-colors placeholder:text-muted-foreground font-sans" />
                  <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Mobile number" className="w-full border border-border px-3 py-2.5 text-sm bg-background outline-none focus:border-primary transition-colors placeholder:text-muted-foreground font-sans" />
                  <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email (optional)" className="w-full border border-border px-3 py-2.5 text-sm bg-background outline-none focus:border-primary transition-colors placeholder:text-muted-foreground font-sans" />
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Any specific requirements?" rows={3} className="w-full border border-border px-3 py-2.5 text-sm bg-background outline-none focus:border-primary transition-colors placeholder:text-muted-foreground resize-none font-sans" />
                  <button type="submit" className="w-full bg-primary text-primary-foreground py-3 text-sm font-sans font-medium hover:bg-primary/90 transition-colors tracking-wide">
                    Request a Callback
                  </button>
                  <div className="flex gap-2">
                    <button type="button" className="flex-1 border border-border py-2.5 text-sm font-sans flex items-center justify-center gap-2 hover:border-primary transition-colors">
                      <Phone size={13} /> Call Now
                    </button>
                    <button type="button" className="flex-1 border border-[#25D366] bg-[#25D366]/5 text-[#1a7a50] py-2.5 text-sm font-sans flex items-center justify-center gap-2 hover:bg-[#25D366]/10 transition-colors">
                      <MessageCircle size={13} /> WhatsApp
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Similar properties */}
        <div className="mt-16 border-t border-border pt-12">
          <h2 className="font-serif text-2xl font-medium mb-6">Similar properties in {property.locality}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(related.length > 0 ? related : fallback).map((p) => (
              <PropertyCard key={p.id} property={p} onClick={() => { onSelectProperty(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CategoryPage ─────────────────────────────────────────────────────────────

function CategoryPage({ navigate, onSelectProperty }: { navigate: (p: Page) => void; onSelectProperty: (p: Property) => void }) {
  const [activeStatus, setActiveStatus] = useState<Status>("Under Development");
  const STATUS_TABS: Status[] = ["Under Development", "Ready to Move", "Resale", "Luxury"];
  const filtered = PROPERTIES.filter((p) => p.status === activeStatus);

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      <div className="relative bg-[#0D1A13] h-60 flex items-end">
        <img
          src="https://images.unsplash.com/photo-1710582308582-55cc0c461c4e?w=1920&h=400&fit=crop&auto=format"
          alt="South Mumbai skyline"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 pb-8 w-full">
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/35 mb-2 font-sans">Browse by status</p>
          <h1 className="font-serif text-4xl text-white font-medium">{activeStatus} Properties</h1>
          <p className="text-white/45 text-sm mt-1.5 font-sans">South Mumbai — curated by Parmar Properties</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-muted sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex overflow-x-auto">
            {STATUS_TABS.map((s) => (
              <button
                key={s}
                onClick={() => setActiveStatus(s)}
                className={`px-5 py-4 text-sm font-sans whitespace-nowrap border-b-2 transition-colors ${activeStatus === s ? "border-primary text-primary font-medium" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              >
                {s}
                <span className="ml-1.5 text-[10px] text-muted-foreground">({PROPERTIES.filter((p) => p.status === s).length})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10">
        {activeStatus === "Under Development" && (
          <div className="bg-primary/5 border border-primary/20 px-5 py-4 mb-8 flex items-start gap-3">
            <div className="w-5 h-5 bg-primary flex items-center justify-center shrink-0 mt-0.5">
              <Check size={10} className="text-primary-foreground" />
            </div>
            <p className="text-sm text-foreground font-sans leading-relaxed">
              <span className="font-semibold">Pre-launch advantage:</span> All under-development listings are MahaRERA-registered. Book early for preferred unit selection and pre-launch pricing benefits.
            </p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <div key={p.id}>
              <PropertyCard property={p} onClick={() => onSelectProperty(p)} />
              {p.possession !== "Ready for Possession" && (
                <div className="bg-muted border border-t-0 border-border px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans">
                    <Calendar size={11} />
                    <span>Possession: <span className="text-foreground font-medium">{p.possession}</span></span>
                  </div>
                  <span className="text-[10px] text-primary font-medium font-sans">RERA ✓</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-28 text-center">
            <p className="font-serif text-xl text-muted-foreground">No properties in this category.</p>
            <button onClick={() => navigate("listings")} className="mt-4 text-sm text-primary hover:underline font-sans">Browse all listings</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ContactPage ─────────────────────────────────────────────────────────────

function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", locality: "", budget: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [enquiryType, setEnquiryType] = useState<"call" | "visit" | "whatsapp">("call");

  return (
    <div className="min-h-screen bg-background">
      <div className="grid lg:grid-cols-2 min-h-[calc(100vh-64px)]">
        {/* Visual panel */}
        <div className="relative bg-primary hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1750758606030-3b200b20b963?w=900&h=1200&fit=crop&auto=format"
            alt="South Mumbai property"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
          <div className="relative h-full flex flex-col justify-between p-12">
            <div>
              <div className="font-serif text-2xl font-medium text-primary-foreground">PARMAR</div>
              <div className="text-[8px] tracking-[0.3em] uppercase text-primary-foreground/35 mt-0.5 font-sans">Properties · Est. 1994</div>
            </div>
            <div>
              <h1 className="font-serif text-4xl text-primary-foreground font-medium leading-snug mb-5">
                Begin your<br />
                <em className="text-[#C3A55E] not-italic">South Mumbai</em><br />
                property journey
              </h1>
              <p className="text-primary-foreground/55 text-sm leading-relaxed mb-10 max-w-xs">
                Leave your details and one of our senior consultants will reach out within 2 hours during business hours.
              </p>
              <div className="space-y-4">
                {[
                  { icon: <Phone size={13} />, label: "+91 98200 00000" },
                  { icon: <MessageCircle size={13} />, label: "WhatsApp us anytime" },
                  { icon: <MapPin size={13} />, label: "Ground Floor, Maker Bhavan No. 1, New Marine Lines" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3 text-primary-foreground/65 text-sm font-sans">
                    <div className="w-7 h-7 border border-primary-foreground/20 flex items-center justify-center shrink-0 mt-0.5">{item.icon}</div>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-md">
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2 font-sans">Get in touch</p>
            <h2 className="font-serif text-3xl text-foreground font-medium mb-2">Talk to us</h2>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed font-sans">
              Whether you are buying, selling, or just beginning to explore — we are here with no obligation.
            </p>

            {/* Enquiry type */}
            <div className="flex gap-2 mb-7">
              {(["call", "visit", "whatsapp"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setEnquiryType(t)}
                  className={`flex-1 py-2.5 text-[10px] tracking-[0.2em] uppercase font-sans border transition-colors ${enquiryType === t ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary"}`}
                >
                  {t === "call" ? "Call Back" : t === "visit" ? "Site Visit" : "WhatsApp"}
                </button>
              ))}
            </div>

            {submitted ? (
              <div className="py-14 text-center border border-border">
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Check size={22} className="text-primary" />
                </div>
                <p className="font-serif text-xl font-medium">Thank you, {form.name}!</p>
                <p className="text-muted-foreground text-sm mt-2 font-sans">We will be in touch very shortly.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground font-sans block mb-1.5">Full Name *</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-border px-3 py-2.5 text-sm bg-background outline-none focus:border-primary transition-colors font-sans" />
                  </div>
                  <div>
                    <label className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground font-sans block mb-1.5">Mobile *</label>
                    <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-border px-3 py-2.5 text-sm bg-background outline-none focus:border-primary transition-colors font-sans" />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground font-sans block mb-1.5">Email</label>
                  <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-border px-3 py-2.5 text-sm bg-background outline-none focus:border-primary transition-colors font-sans" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground font-sans block mb-1.5">Preferred Locality</label>
                    <select value={form.locality} onChange={(e) => setForm({ ...form, locality: e.target.value })} className="w-full border border-border px-3 py-2.5 text-sm bg-background text-foreground outline-none focus:border-primary transition-colors cursor-pointer font-sans">
                      <option value="">Any</option>
                      {["Worli", "Malabar Hill", "Cuffe Parade", "Breach Candy", "Tardeo", "Walkeshwar"].map((l) => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground font-sans block mb-1.5">Budget</label>
                    <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="w-full border border-border px-3 py-2.5 text-sm bg-background text-foreground outline-none focus:border-primary transition-colors cursor-pointer font-sans">
                      <option value="">Any</option>
                      <option>₹5 Cr – ₹10 Cr</option>
                      <option>₹10 Cr – ₹20 Cr</option>
                      <option>₹20 Cr – ₹50 Cr</option>
                      <option>Above ₹50 Cr</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground font-sans block mb-1.5">Message</label>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} placeholder="Tell us what you are looking for…" className="w-full border border-border px-3 py-2.5 text-sm bg-background outline-none focus:border-primary transition-colors placeholder:text-muted-foreground resize-none font-sans" />
                </div>
                <button type="submit" className="w-full bg-primary text-primary-foreground py-3.5 text-sm font-sans font-medium tracking-wide hover:bg-primary/90 transition-colors">
                  {enquiryType === "call" ? "Request a Callback" : enquiryType === "visit" ? "Schedule a Site Visit" : "Send WhatsApp Enquiry"}
                </button>
                <p className="text-[10px] text-muted-foreground text-center font-sans leading-relaxed">
                  By submitting you agree to our privacy policy. We never share your details.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [selected, setSelected] = useState<Property>(PROPERTIES[0]);

  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSelectProperty = (p: Property) => {
    setSelected(p);
    navigate("detail");
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .font-serif { font-family: 'Playfair Display', Georgia, serif; }
        body { background-color: #F8F5F0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(26,26,24,0.2); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(26,26,24,0.35); }
      `}</style>
      <Navbar current={page} navigate={navigate} />
      {page === "home"     && <HomePage navigate={navigate} onSelectProperty={onSelectProperty} />}
      {page === "listings" && <ListingsPage navigate={navigate} onSelectProperty={onSelectProperty} />}
      {page === "detail"   && <PropertyDetailPage property={selected} navigate={navigate} onSelectProperty={onSelectProperty} />}
      {page === "category" && <CategoryPage navigate={navigate} onSelectProperty={onSelectProperty} />}
      {page === "contact"  && <ContactPage />}
      <Footer navigate={navigate} />
    </div>
  );
}
