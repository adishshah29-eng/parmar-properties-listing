import React from "react";
import { createClient } from "@/lib/supabase/server";
import { getProjectStatus } from "@/lib/utils/project-status";
import Image from "next/image";
import Link from "next/link";
import { Check, ArrowLeft, Building2 } from "lucide-react";

export const metadata = {
  title: "Compare Properties | Parmar Properties",
  description: "Compare selected luxury properties side-by-side.",
};

function formatInr(value: number) {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toLocaleString("en-IN", { maximumFractionDigits: 2 })} L`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

// Next.js 15+ searchParams are Promises
export default async function ComparePage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
  const { ids } = await searchParams;
  
  if (!ids) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <Building2 className="w-16 h-16 text-muted-foreground mb-4 opacity-20" />
        <h1 className="text-3xl font-serif mb-2">No Properties Selected</h1>
        <p className="text-muted-foreground mb-6">You haven't selected any properties to compare.</p>
        <Link href="/listings" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
          Browse Properties
        </Link>
      </div>
    );
  }

  const projectIds = ids.split(',').slice(0, 3); // Max 3 for UI purposes

  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      *,
      developer:developers(name),
      images:project_images(url),
      configurations:project_configurations(
        id, bhk, carpetArea, pricePerSqft, totalUnits, availableUnits
      ),
      amenities:project_amenities(
        amenity:amenities(id, name, category, icon)
      )
    `)
    .in('id', projectIds);

  if (error || !projects || projects.length === 0) {
    return <div className="p-20 text-center text-red-500">Failed to load properties for comparison.</div>;
  }

  // Ensure they are displayed in the order of the IDs in the URL if possible
  const orderedProjects = projectIds.map(id => projects.find(p => p.id === id)).filter(Boolean) as typeof projects;

  // Extract all unique amenities across all selected projects
  const allAmenities = new Map<string, string>();
  orderedProjects.forEach(p => {
    p.amenities?.forEach((a: any) => {
      if (a.amenity) {
        allAmenities.set(a.amenity.name, a.amenity.name);
      }
    });
  });
  const uniqueAmenitiesList = Array.from(allAmenities.values()).sort();

  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <div className="container max-w-7xl mx-auto px-6">
        <Link href="/listings" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft size={16} />
          <span>Back to listings</span>
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-serif mb-12">Compare Properties</h1>

        <div className="overflow-x-auto pb-8">
          <div className="min-w-[800px] grid" style={{ gridTemplateColumns: `200px repeat(${orderedProjects.length}, minmax(300px, 1fr))` }}>
            
            {/* Row 1: Header/Images */}
            <div className="p-4 border-b border-border bg-background sticky left-0 z-10 flex items-end">
              <span className="font-medium text-lg">Overview</span>
            </div>
            {orderedProjects.map(project => (
              <div key={`header-${project.id}`} className="p-4 border-b border-border text-center">
                <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 bg-muted">
                  {project.images?.[0]?.url && (
                    <Image 
                      src={project.images[0].url.startsWith('http') ? project.images[0].url : `/${project.images[0].url}`}
                      alt={project.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <h2 className="text-xl font-serif font-medium">{project.name}</h2>
                <p className="text-muted-foreground text-sm mt-1">{project.location}, {project.city}</p>
                <Link href={`/projects/${project.slug}`} className="mt-4 inline-block px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg hover:bg-muted transition-colors">
                  View Details
                </Link>
              </div>
            ))}

            {/* Row: Status */}
            <div className="p-4 border-b border-border bg-background sticky left-0 z-10 flex items-center font-medium">Status</div>
            {orderedProjects.map(project => {
              const status = getProjectStatus(project);
              return (
                <div key={`status-${project.id}`} className="p-4 border-b border-border flex items-center justify-center">
                  <span className="px-3 py-1 bg-muted rounded-full text-xs tracking-wider uppercase font-semibold">
                    {status.replace(/_/g, " ")}
                  </span>
                </div>
              );
            })}

            {/* Row: Developer */}
            <div className="p-4 border-b border-border bg-background sticky left-0 z-10 flex items-center font-medium">Developer</div>
            {orderedProjects.map(project => (
              <div key={`dev-${project.id}`} className="p-4 border-b border-border flex items-center justify-center">
                {project.developer?.name || "N/A"}
              </div>
            ))}

            {/* Row: Configurations */}
            <div className="p-4 border-b border-border bg-background sticky left-0 z-10 flex items-center font-medium">Configurations</div>
            {orderedProjects.map(project => {
              const bhks = Array.from(new Set(project.configurations?.map((c: any) => c.bhk))).sort();
              return (
                <div key={`config-${project.id}`} className="p-4 border-b border-border flex items-center justify-center">
                  {bhks.length > 0 ? `${bhks.join(", ")} BHK` : "N/A"}
                </div>
              );
            })}

            {/* Row: Carpet Area */}
            <div className="p-4 border-b border-border bg-background sticky left-0 z-10 flex items-center font-medium">Carpet Area</div>
            {orderedProjects.map(project => {
              const areas = project.configurations?.map((c: any) => c.carpetArea) || [];
              const min = Math.min(...areas);
              const max = Math.max(...areas);
              return (
                <div key={`area-${project.id}`} className="p-4 border-b border-border flex items-center justify-center">
                  {areas.length > 0 ? (min === max ? `${min} sq ft` : `${min} - ${max} sq ft`) : "N/A"}
                </div>
              );
            })}

            {/* Row: Estimated Price */}
            <div className="p-4 border-b border-border bg-background sticky left-0 z-10 flex items-center font-medium">Starting Price</div>
            {orderedProjects.map(project => {
              let minPrice = Infinity;
              project.configurations?.forEach((c: any) => {
                const price = c.carpetArea * c.pricePerSqft;
                if (price < minPrice) minPrice = price;
              });
              return (
                <div key={`price-${project.id}`} className="p-4 border-b border-border flex items-center justify-center font-medium text-lg">
                  {minPrice !== Infinity ? formatInr(minPrice) : "On Request"}
                </div>
              );
            })}

            {/* Amenities Section Header */}
            <div className="p-4 bg-muted/30 sticky left-0 z-10 font-serif text-lg mt-8 col-span-full">
              Amenities Comparison
            </div>

            {/* Dynamic Amenity Rows */}
            {uniqueAmenitiesList.map((amenityName, idx) => (
              <React.Fragment key={`amenity-${idx}`}>
                <div className="p-4 border-b border-border/50 bg-background sticky left-0 z-10 flex items-center text-sm">
                  {amenityName}
                </div>
                {orderedProjects.map(project => {
                  const hasAmenity = project.amenities?.some((a: any) => a.amenity?.name === amenityName);
                  return (
                    <div key={`amenity-${project.id}-${idx}`} className="p-4 border-b border-border/50 flex items-center justify-center">
                      {hasAmenity ? (
                        <Check className="text-primary w-5 h-5" />
                      ) : (
                        <span className="text-muted-foreground/30">-</span>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}

          </div>
        </div>

      </div>
    </main>
  );
}
