import { createClient } from "@/lib/supabase/server";
import { getProjectStatus } from "@/lib/project-status";
import Link from "next/link";
import { ArrowRight, Check, MapPin, ChevronDown, Search } from "lucide-react";
import Image from "next/image";
import { StatusBadge } from "../components/PropertyCard";

export const revalidate = 3600;

export default async function Home() {
  const supabase = await createClient();
  
  // Fetch a few projects for the featured section
  const { data: rawProjects } = await supabase
    .from('projects')
    .select(`
      *,
      developer:developers!inner(*),
      images:project_images(url, sortOrder),
      configurations(*)
    `)
    .order('createdAt', { ascending: false })
    .limit(3);

  const featured = (rawProjects || []).map(p => {
    const sortedImages = [...(p.images || [])].sort((a, b) => a.sortOrder - b.sortOrder);
    const coverImage = sortedImages.length > 0 ? sortedImages[0] : null;

    const sortedConfigs = [...(p.configurations || [])].sort((a, b) => {
      if (a.bhk !== b.bhk) return a.bhk - b.bhk;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    let minPrice = Infinity;
    let maxPrice = -Infinity;
    if (sortedConfigs.length > 0) {
      sortedConfigs.forEach((cfg: any) => {
        const price = cfg.carpetArea * cfg.pricePerSqft;
        if (price < minPrice) minPrice = price;
        if (price > maxPrice) maxPrice = price;
      });
    }

    let priceText = "Price on request";
    if (minPrice !== Infinity && maxPrice !== -Infinity) {
      if (minPrice >= 10000000) {
        priceText = `₹${(minPrice / 10000000).toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr`;
      } else if (minPrice >= 100000) {
        priceText = `₹${(minPrice / 100000).toLocaleString("en-IN", { maximumFractionDigits: 2 })} L`;
      } else {
        priceText = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(minPrice);
      }
    }
    
    const minBhk = sortedConfigs.length > 0 ? Math.min(...sortedConfigs.map((c: any) => c.bhk)) : null;

    return {
      ...p,
      images: coverImage ? [coverImage] : [],
      configurations: sortedConfigs,
      derivedStatus: getProjectStatus(sortedConfigs),
      priceText,
      minBhk
    };
  });

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

          <div className="bg-white/97 backdrop-blur mt-2 max-w-3xl flex flex-col md:flex-row shadow-2xl">
            <div className="flex-1 flex items-center gap-3 px-5 py-3.5 border-b md:border-b-0 md:border-r border-border">
              <MapPin size={15} className="text-muted-foreground shrink-0" />
              <input
                placeholder="Locality — Worli, Malabar Hill…"
                className="w-full text-sm bg-transparent text-foreground placeholder:text-muted-foreground outline-none font-sans"
              />
            </div>
            <div className="flex-1 flex items-center gap-3 px-5 py-3.5 border-b md:border-b-0 md:border-r border-border">
              <ChevronDown size={15} className="text-muted-foreground shrink-0" />
              <select className="w-full text-sm bg-transparent text-foreground outline-none cursor-pointer font-sans appearance-none">
                <option value="">Budget Range</option>
                <option>₹5 Cr – ₹10 Cr</option>
                <option>₹10 Cr – ₹20 Cr</option>
                <option>₹20 Cr – ₹50 Cr</option>
                <option>Above ₹50 Cr</option>
              </select>
            </div>
            <div className="flex-1 flex items-center gap-3 px-5 py-3.5 border-b md:border-b-0 md:border-r border-border">
              <ChevronDown size={15} className="text-muted-foreground shrink-0" />
              <select className="w-full text-sm bg-transparent text-foreground outline-none cursor-pointer font-sans appearance-none">
                <option value="">Property Type</option>
                <option>UNDER_CONSTRUCTION</option>
                <option>READY_TO_MOVE</option>
                <option>RESALE</option>
                <option>NEW_LAUNCH</option>
              </select>
            </div>
            <Link
              href="/listings"
              className="bg-primary text-primary-foreground px-7 py-3.5 font-sans font-medium text-sm tracking-wide hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shrink-0"
            >
              <Search size={14} /> Search
            </Link>
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
              <Link
                key={cat.id}
                href="/listings"
                className="group bg-card border border-border p-6 text-left hover:bg-primary hover:border-primary transition-all duration-300 block"
              >
                <div className="font-serif text-3xl font-medium mb-0.5 group-hover:text-primary-foreground transition-colors">{cat.count}</div>
                <div className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground group-hover:text-primary-foreground/50 mb-3 font-sans transition-colors">Properties</div>
                <h3 className="font-serif text-sm font-medium mb-2 leading-snug group-hover:text-primary-foreground transition-colors">{cat.label}</h3>
                <p className="text-xs text-muted-foreground group-hover:text-primary-foreground/65 leading-relaxed transition-colors">{cat.description}</p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-primary group-hover:text-primary-foreground/80 transition-all opacity-0 group-hover:opacity-100">
                  Browse <ArrowRight size={11} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured listings */}
      {featured.length > 0 && (
        <section className="bg-background py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2 font-sans">Hand-picked for you</p>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground font-medium">Featured residences</h2>
              </div>
              <Link href="/listings" className="hidden md:flex items-center gap-2 text-sm text-primary font-sans font-medium hover:gap-3 transition-all">
                View all listings <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Link
                href={`/projects/${featured[0].slug}`}
                className="md:col-span-2 relative group cursor-pointer overflow-hidden bg-muted h-[500px] block"
              >
                {featured[0].images.length > 0 && (
                  <img src={featured[0].images[0].url.startsWith('/') ? featured[0].images[0].url : `/${featured[0].images[0].url}`} alt={featured[0].name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute top-4 left-4"><StatusBadge status={featured[0].derivedStatus} /></div>
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <p className="text-white/55 text-[10px] tracking-[0.3em] uppercase mb-1 font-sans">{featured[0].location}, {featured[0].city}</p>
                  <h3 className="font-serif text-2xl text-white font-medium mb-2">{featured[0].name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[#C3A55E] font-serif text-xl">{featured[0].priceText}</span>
                    <span className="text-white/55 text-xs font-sans">{featured[0].minBhk ? `${featured[0].minBhk} BHK` : ''}</span>
                  </div>
                </div>
              </Link>

              <div className="flex flex-col gap-4">
                {featured.slice(1, 3).map((p) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.slug}`}
                    className="relative group cursor-pointer overflow-hidden bg-muted flex-1 min-h-[238px] block"
                  >
                    {p.images.length > 0 && (
                      <img src={p.images[0].url.startsWith('/') ? p.images[0].url : `/${p.images[0].url}`} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3"><StatusBadge status={p.derivedStatus} /></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white/55 text-[10px] tracking-[0.3em] uppercase mb-0.5 font-sans">{p.location}</p>
                      <h3 className="font-serif text-base text-white font-medium">{p.name}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[#C3A55E] font-serif">{p.priceText}</span>
                        <span className="text-white/55 text-[10px] font-sans">{p.minBhk ? `${p.minBhk} BHK` : ''}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Neighborhoods */}
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
              <Link key={n.name} href="/listings" className="group relative overflow-hidden h-72 bg-primary-foreground/10 block">
                <img src={n.image} alt={n.name} className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:opacity-65 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                  <h3 className="font-serif text-xl text-white font-medium">{n.name}</h3>
                  <p className="text-white/55 text-xs mt-0.5 font-sans">{n.tagline}</p>
                  <p className="text-[#C3A55E] text-xs mt-2 font-sans">{n.count} properties</p>
                </div>
              </Link>
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
              <Link
                href="/contact"
                className="mt-8 bg-primary text-primary-foreground px-6 py-3 text-sm font-sans font-medium tracking-wide hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
              >
                Talk to a consultant <ArrowRight size={13} />
              </Link>
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
