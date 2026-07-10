import { createClient } from "@/lib/supabase/server";
import { getProjectStatus } from "@/lib/utils/project-status";
import { FeaturedTemplatesViewer } from "@/components/devloperr/FeaturedTemplatesViewer";
import { NeighborhoodTemplatesViewer } from "@/components/devloperr/NeighborhoodTemplatesViewer";
import { NEIGHBORHOODS } from "@/lib/constants";

export const revalidate = 0; // Don't cache this preview page

export default async function DevloperrPage() {
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

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="pt-32 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-5 md:px-8 mb-16 text-center flex flex-col items-center">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-[10px] tracking-[0.3em] uppercase text-primary font-sans font-semibold">Designer Toolkit</span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl text-foreground mb-6 font-medium tracking-tight">Featured Property Layouts</h1>
          <p className="text-muted-foreground font-sans text-lg max-w-2xl mx-auto leading-relaxed">
            Curate the perfect presentation for South Mumbai's finest properties. Select a structural template below to preview it with live real estate data.
          </p>
        </div>
        <FeaturedTemplatesViewer properties={featured} />

        <div className="max-w-7xl mx-auto px-5 md:px-8 mt-24 mb-16 text-center flex flex-col items-center border-t border-border/50 pt-24">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-[10px] tracking-[0.3em] uppercase text-primary font-sans font-semibold">Designer Toolkit</span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl text-foreground mb-6 font-medium tracking-tight">Neighborhood Layouts</h1>
          <p className="text-muted-foreground font-sans text-lg max-w-2xl mx-auto leading-relaxed">
            Select an animation style for the location exploration module. Preview these high-end, smooth transitioning carousel options below.
          </p>
        </div>
        <NeighborhoodTemplatesViewer neighborhoods={NEIGHBORHOODS} />
      </div>
    </div>
  );
}
