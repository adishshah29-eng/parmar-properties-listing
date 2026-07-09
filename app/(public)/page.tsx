import { createClient } from "@/lib/supabase/server";
import { getProjectStatus } from "@/lib/utils/project-status";
import Link from "next/link";
import { ArrowRight, Check, MapPin, ChevronDown, Search, Building2, Key, RefreshCw, Gem } from "lucide-react";
import Image from "next/image";
import { StatusBadge } from "@/components/common/PropertyCard";
import { HeroScrollContainer } from "@/components/common/HeroScrollContainer";
import { HomeSearchBar } from "@/components/common/HomeSearchBar";
import FadeIn from "@/components/common/FadeIn";
import { Suspense } from "react";

export const revalidate = 3600;

async function DynamicHomeSearchBar() {
  const supabase = await createClient();
  const [{ data: developers }, { data: projectsForCities }] = await Promise.all([
    supabase.from('developers').select('name').order('name'),
    supabase.from('projects').select('city')
  ]);
  const cities = ["All", ...Array.from(new Set((projectsForCities || []).map(p => p.city)))];
  const devNames = ["All", ...Array.from(new Set((developers || []).map(d => d.name)))];

  return <HomeSearchBar cities={cities} developers={devNames} />;
}

async function DynamicFeaturedListings() {
  const supabase = await createClient();
  
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

  if (featured.length === 0) return null;

  return (
    <section className="bg-background pt-2 pb-20 md:pt-4 md:pb-28">
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

        <div className="grid md:grid-cols-3 gap-6 group/featured">
          <Link
            href={`/projects/${featured[0].id}`}
            className="md:col-span-2 relative cursor-pointer overflow-hidden bg-muted h-[500px] block rounded-3xl group-hover/featured:opacity-40 hover:!opacity-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/20"
          >
            {featured[0].images.length > 0 && (
              <Image 
                src={featured[0].images[0].url.startsWith('/') ? featured[0].images[0].url : `/${featured[0].images[0].url}`} 
                alt={featured[0].name} 
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                priority={true}
                className="object-cover transition-transform duration-1000 ease-out hover:scale-110" 
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute top-5 left-5"><StatusBadge status={featured[0].derivedStatus} /></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-500 hover:-translate-y-2">
              <p className="text-white/70 text-[10px] tracking-[0.3em] uppercase mb-1.5 font-sans">{featured[0].location}, {featured[0].city}</p>
              <h3 className="font-serif text-3xl text-white font-medium mb-3 drop-shadow-md">{featured[0].name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-[#B59E7E] font-serif text-2xl drop-shadow-md">{featured[0].priceText}</span>
                <span className="text-white/70 text-xs font-sans bg-black/30 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">{featured[0].minBhk ? `${featured[0].minBhk} BHK` : ''}</span>
              </div>
            </div>
          </Link>

          <div className="flex flex-col gap-6">
            {featured.slice(1, 3).map((p, index) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="relative cursor-pointer overflow-hidden bg-muted flex-1 min-h-[238px] block rounded-3xl group-hover/featured:opacity-40 hover:!opacity-100 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/15"
              >
                {p.images.length > 0 && (
                  <Image 
                    src={p.images[0].url.startsWith('/') ? p.images[0].url : `/${p.images[0].url}`} 
                    alt={p.name} 
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={index === 0}
                    className="object-cover transition-transform duration-1000 ease-out hover:scale-110" 
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-4 left-4"><StatusBadge status={p.derivedStatus} /></div>
                <div className="absolute bottom-0 left-0 right-0 p-5 transform transition-transform duration-500 hover:-translate-y-1">
                  <p className="text-white/70 text-[10px] tracking-[0.3em] uppercase mb-1 font-sans">{p.location}</p>
                  <h3 className="font-serif text-xl text-white font-medium drop-shadow-md">{p.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[#B59E7E] font-serif text-lg drop-shadow-md">{p.priceText}</span>
                    <span className="text-white/70 text-[10px] font-sans bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-md border border-white/10">{p.minBhk ? `${p.minBhk} BHK` : ''}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const NEIGHBORHOODS = [
    { name: "Worli", tagline: "Sea-facing skyline", count: 28, image: "https://images.unsplash.com/photo-1679249010086-b8a932c8cafc?w=600&h=800&fit=crop&auto=format" },
    { name: "Malabar Hill", tagline: "Legacy addresses", count: 14, image: "https://images.unsplash.com/photo-1750758605895-34f909ca82ce?w=600&h=800&fit=crop&auto=format" },
    { name: "Cuffe Parade", tagline: "The original prestige", count: 19, image: "https://images.unsplash.com/photo-1710582308582-55cc0c461c4e?w=600&h=800&fit=crop&auto=format" },
    { name: "Breach Candy", tagline: "Quiet exclusivity", count: 11, image: "https://images.unsplash.com/photo-1750758606030-3b200b20b963?w=600&h=800&fit=crop&auto=format" },
  ];

  const CATEGORIES = [
    { id: "under-development", label: "Under Development", count: 32, icon: <Building2 size={24} className="mb-4 text-primary opacity-80 group-hover:opacity-100 transition-opacity" />, description: "Early-access pricing on tomorrow's finest addresses" },
    { id: "ready-to-move", label: "Ready to Move", count: 18, icon: <Key size={24} className="mb-4 text-primary opacity-80 group-hover:opacity-100 transition-opacity" />, description: "Move in immediately — no waiting, no uncertainty" },
    { id: "resale", label: "Resale", count: 27, icon: <RefreshCw size={24} className="mb-4 text-primary opacity-80 group-hover:opacity-100 transition-opacity" />, description: "Pre-owned homes with established character and location" },
    { id: "luxury", label: "Luxury & Ultra-Luxury", count: 9, icon: <Gem size={24} className="mb-4 text-primary opacity-80 group-hover:opacity-100 transition-opacity" />, description: "South Mumbai's most exceptional residences, curated" },
  ];

  const TESTIMONIALS = [
    { name: "Arjun & Priya Mehta", locality: "Worli", quote: "Parmar Properties found us a home we didn't know existed. Their knowledge of South Mumbai's micro-markets is genuinely unparalleled — no portal comes close.", rating: 5 },
    { name: "Cyrus Patel", locality: "Malabar Hill", quote: "I've dealt with three brokerages over the years. Parmar is the only one that feels like a private concierge, not a listing portal. Completely different experience.", rating: 5 },
    { name: "Sheila Rodrigues", locality: "Cuffe Parade", quote: "From shortlisting through RERA registration, every detail was managed with real care. They turned what I dreaded into an actual pleasure.", rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <HeroScrollContainer>
        {/* Intentionally left blank as requested */}
      </HeroScrollContainer>

      {/* Search Bar Section with Suspense */}
      <Suspense fallback={<div className="h-24 max-w-5xl mx-auto -mt-12 bg-background border border-border/50 shadow-xl rounded-2xl animate-pulse z-20 relative"></div>}>
        <DynamicHomeSearchBar />
      </Suspense>

      {/* Category tiles */}
      <section className="bg-background relative pt-4 pb-8 md:pb-12">
        <div className="absolute inset-0 bg-muted/40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
          <div className="mb-8 text-center">
            <p className="text-[11px] tracking-[0.25em] uppercase text-primary/70 mb-2 font-sans font-semibold">Browse by type</p>
            <h2 className="font-serif text-3xl md:text-5xl text-foreground font-medium tracking-tight">Every kind of<br />South Mumbai home</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat, idx) => (
              <FadeIn key={cat.id} delay={0.1 * idx}>
                <Link
                  href="/listings"
                  className="group relative h-full bg-white/5 dark:bg-black/20 backdrop-blur-md border border-border/60 p-8 rounded-3xl text-left hover:bg-card hover:border-primary/30 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-primary/5 overflow-hidden block"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    {cat.icon}
                    <div className="font-serif text-4xl font-medium mb-1 text-foreground transition-colors">{cat.count}</div>
                    <div className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground group-hover:text-primary/70 mb-5 font-sans font-semibold transition-colors">Properties</div>
                    <h3 className="font-serif text-xl font-medium mb-3 leading-snug group-hover:text-primary transition-colors">{cat.label}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-grow">{cat.description}</p>
                    
                    <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-primary transition-all duration-300 opacity-0 transform -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0">
                      Browse Collection <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Featured listings with Suspense */}
      <Suspense fallback={
        <div className="bg-background pt-2 pb-20 md:pt-4 md:pb-28 max-w-7xl mx-auto px-5 md:px-8">
          <div className="w-48 h-8 bg-muted rounded-md animate-pulse mb-10"></div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-[500px] bg-muted rounded-3xl animate-pulse"></div>
            <div className="flex flex-col gap-6">
              <div className="flex-1 min-h-[238px] bg-muted rounded-3xl animate-pulse"></div>
              <div className="flex-1 min-h-[238px] bg-muted rounded-3xl animate-pulse"></div>
            </div>
          </div>
        </div>
      }>
        <DynamicFeaturedListings />
      </Suspense>

      {/* Neighborhoods */}
      <section className="bg-primary py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-primary-foreground/35 mb-2 font-sans">Explore by location</p>
              <h2 className="font-serif text-3xl md:text-4xl text-primary-foreground font-medium">South Mumbai's<br />finest postcodes</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:flex md:flex-row gap-3 md:h-[400px]">
            {NEIGHBORHOODS.map((n) => (
              <Link key={n.name} href="/listings" className="group relative overflow-hidden h-56 md:h-full md:flex-1 md:hover:[flex:2_2_0%] transition-all duration-500 ease-out bg-primary-foreground/10 block rounded-2xl">
                <Image src={n.image} alt={n.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="absolute inset-0 object-cover opacity-45 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-left transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="font-serif text-2xl text-white font-medium">{n.name}</h3>
                  <p className="text-white/70 text-sm mt-1 font-sans opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{n.tagline}</p>
                  <p className="text-[#B59E7E] text-sm mt-3 font-sans font-medium">{n.count} properties</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Parmar */}
      <section className="bg-background pt-4 pb-20 md:pt-8 md:pb-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeIn>
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
                ].map((item, idx) => (
                  <FadeIn key={item.title} delay={0.1 * idx} className="flex gap-4">
                    <div className="w-5 h-5 bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 rounded">
                      <Check size={10} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-sans font-semibold text-sm text-foreground mb-0.5">{item.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
              <Link
                href="/contact"
                className="mt-8 bg-primary text-primary-foreground px-6 py-3 text-sm font-sans font-medium tracking-wide hover:bg-primary/90 transition-colors inline-flex items-center gap-2 rounded-lg"
              >
                Talk to a consultant <ArrowRight size={13} />
              </Link>
            </FadeIn>

            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden bg-muted">
                <Image
                  src="https://images.unsplash.com/photo-1758193431355-54df41421657?w=800&h=1000&fit=crop&auto=format"
                  alt="Premium South Mumbai building"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
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
            {TESTIMONIALS.map((t, idx) => (
              <FadeIn key={t.name} delay={0.15 * idx}>
                <div className="bg-white/5 backdrop-blur-lg border border-border/50 p-8 rounded-3xl hover:-translate-y-2 hover:shadow-xl hover:shadow-black/5 transition-all duration-500 h-full">
                  <div className="flex gap-1 mb-5">
                    {[...Array(t.rating)].map((_, i) => <div key={i} className="w-2.5 h-2.5 bg-[#B59E7E]" />)}
                  </div>
                  <blockquote className="font-serif text-base text-foreground leading-relaxed mb-6 italic">"{t.quote}"</blockquote>
                  <div>
                    <div className="font-sans font-semibold text-sm text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground font-sans">{t.locality}, South Mumbai</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
