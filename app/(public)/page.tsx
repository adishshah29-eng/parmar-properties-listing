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
import { cookies } from "next/headers";
import { Template1, Template2, Template3, Template4, Template5, Template6 } from "@/components/common/FeaturedTemplates";
import { Template1 as NeighborhoodTemplate1, Template2 as NeighborhoodTemplate2, Template3 as NeighborhoodTemplate3, Template4 as NeighborhoodTemplate4, Template5 as NeighborhoodTemplate5 } from "@/components/common/NeighborhoodTemplates";
import { NEIGHBORHOODS } from "@/lib/constants";

export const revalidate = 3600;

async function DynamicHomeSearchBar() {
  const supabase = await createClient();
  const { data: projectsForLocations } = await supabase.from('projects').select('location');
  const locations = ["All", ...Array.from(new Set((projectsForLocations || []).map(p => p.location)))];

  return <HomeSearchBar locations={locations} />;
}

async function DynamicFeaturedListings() {
  const cookieStore = await cookies();
  const selectedTemplate = cookieStore.get("selected_featured_template")?.value || "1";

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
    .limit(6);

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

  switch (selectedTemplate) {
    case "2": return <Template2 properties={featured} />;
    case "3": return <Template3 properties={featured} />;
    case "4": return <Template4 properties={featured} />;
    case "5": return <Template5 properties={featured} />;
    case "6": return <Template6 properties={featured} />;
    case "1":
    default:
      return <Template1 properties={featured} />;
  }
}

async function DynamicNeighborhoodCarousel() {
  const cookieStore = await cookies();
  const selectedTemplate = cookieStore.get("selected_neighborhood_template")?.value || "1";

  switch (selectedTemplate) {
    case "2": return <NeighborhoodTemplate2 neighborhoods={NEIGHBORHOODS} />;
    case "3": return <NeighborhoodTemplate3 neighborhoods={NEIGHBORHOODS} />;
    case "4": return <NeighborhoodTemplate4 neighborhoods={NEIGHBORHOODS} />;
    case "5": return <NeighborhoodTemplate5 neighborhoods={NEIGHBORHOODS} />;
    case "1":
    default:
      return <NeighborhoodTemplate1 neighborhoods={NEIGHBORHOODS} />;
  }
}

export default function Home() {
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
      <section className="bg-primary py-10 md:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex items-end justify-between mb-4 md:mb-6">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-primary-foreground/35 mb-2 font-sans">Explore by location</p>
              <h2 className="font-serif text-3xl md:text-4xl text-primary-foreground font-medium">South Mumbai's<br />finest postcodes</h2>
            </div>
          </div>
          <div className="mt-4 mb-4 md:mb-8">
            <Suspense fallback={<div className="w-full h-[400px] md:h-[480px] bg-muted animate-pulse rounded-[2rem] mt-4 md:mt-8"></div>}>
              <DynamicNeighborhoodCarousel />
            </Suspense>
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
                className="mt-8 bg-primary text-primary-foreground px-6 py-3 text-sm font-sans font-medium tracking-wide hover:bg-primary/90 transition-colors inline-flex items-center gap-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                aria-label="Talk to a consultant"
              >
                Talk to a consultant <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </FadeIn>

            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
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
