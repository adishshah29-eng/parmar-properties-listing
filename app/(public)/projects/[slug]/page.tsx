import { createClient } from "@/lib/supabase/server";
import { getProjectStatus } from "@/lib/utils/project-status";
import { buildWhatsAppLink } from "@/lib/utils/whatsapp";
import { notFound } from "next/navigation";
import ImageGalleryClient from "./ImageGalleryClient";
import { Metadata } from "next";
import Image from "next/image";
import FadeIn from "@/components/common/FadeIn";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from('projects')
    .select('name, description, images:project_images(url)')
    .eq('slug', slug)
    .single();

  if (!project) return { title: "Not Found" };

  const title = `${project.name} | Parmar Properties`;
  const description = project.description || `Explore ${project.name} by Parmar Properties.`;
  const ogImage = project.images?.[0]?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : [],
    }
  };
}

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

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from('projects')
    .select(`
      *,
      developer:developers(*),
      images:project_images(*),
      documents:project_documents(*),
      configurations(
        *,
        floorPlans:floor_plans(*)
      )
    `)
    .eq('slug', slug)
    .single();

  if (!project) notFound();

  // Sort relations
  project.images.sort((a: any, b: any) => a.sortOrder - b.sortOrder);
  project.configurations.sort((a: any, b: any) => {
    if (a.bhk !== b.bhk) return a.bhk - b.bhk;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const { data: settings } = await supabase.from('site_settings').select('*').limit(1).single();
  const waNumber = settings?.whatsappNumber || "919876543210";
  const enquireUrl = buildWhatsAppLink(waNumber, project.name, "enquire");
  const siteVisitUrl = buildWhatsAppLink(waNumber, project.name, "site_visit");

  const derivedStatus = getProjectStatus(project.configurations);

  let minBhk = 0, maxBhk = 0;
  let minArea = 0, maxArea = 0;
  let minPrice = 0, maxPrice = 0;

  if (project.configurations && project.configurations.length > 0) {
    const bhks = project.configurations.map((c: any) => parseFloat(c.bhk)).filter((v: any) => !isNaN(v));
    const areas = project.configurations.map((c: any) => c.carpetArea).filter(Boolean);
    const prices = project.configurations.map((c: any) => c.carpetArea * c.pricePerSqft).filter(Boolean);
    
    if (bhks.length > 0) {
      minBhk = Math.min(...bhks);
      maxBhk = Math.max(...bhks);
    }
    if (areas.length > 0) {
      minArea = Math.min(...areas);
      maxArea = Math.max(...areas);
    }
    if (prices.length > 0) {
      minPrice = Math.min(...prices);
      maxPrice = Math.max(...prices);
    }
  }

  const bhkString = minBhk === maxBhk ? (minBhk ? `${minBhk} bd` : 'Contact for details') : `${minBhk} - ${maxBhk} bd`;
  const areaString = minArea === maxArea ? (minArea ? `${minArea} sq ft` : 'Contact for details') : `${minArea} - ${maxArea} sq ft`;
  const priceString = minPrice === maxPrice ? (minPrice ? formatInr(minPrice) : 'Price on request') : `${formatInr(minPrice)} - ${formatInr(maxPrice)}`;


  const amenitiesList = project.amenities ? project.amenities.split(',').map((s: string) => s.trim()).filter(Boolean) : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: project.name,
    description: project.description,
    image: project.images?.[0]?.url || "",
    address: {
      '@type': 'PostalAddress',
      addressLocality: project.city,
      streetAddress: project.location,
    }
  };

  return (
    <div className="body-area pb-[100px] pt-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="wrap">
        
        {/* Header Section */}
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="font-sans text-3xl md:text-4xl text-foreground font-semibold m-0 mb-2 leading-tight tracking-tight">{project.name}</h1>
            <div className="text-base text-muted-foreground mb-3">{project.location}, {project.city}</div>
            <div className="text-sm font-medium text-primary cursor-pointer hover:underline">
              {project.developer.name}
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        {(() => {
          const fallbackImages = [
            { id: 'f1', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop', label: 'Exterior View', sortOrder: 1 },
            { id: 'f2', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop', label: 'Modern Kitchen', sortOrder: 2 },
            { id: 'f3', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', label: 'Living Room', sortOrder: 3 },
            { id: 'f4', url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop', label: 'Master Bedroom', sortOrder: 4 },
            { id: 'f5', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2070&auto=format&fit=crop', label: 'Bathroom', sortOrder: 5 }
          ];
          let displayImages = project.images ? [...project.images] : [];
          if (displayImages.length < 5) {
            const needed = 5 - displayImages.length;
            displayImages = [...displayImages, ...fallbackImages.slice(0, needed)];
          }
          
          return <ImageGalleryClient images={displayImages} />;
        })()}

        {/* Stats Bar */}
        <div className="mt-8 mb-8 grid grid-cols-2 md:grid-cols-4 bg-card border border-border rounded-xl shadow-sm overflow-hidden divide-x divide-y md:divide-y-0 divide-border">
          <div className="p-4 md:p-6 flex flex-col justify-center">
            <span className="text-xs text-muted-foreground mb-1 font-medium">Pricing</span>
            <span className="text-lg md:text-xl font-bold text-foreground">{priceString}</span>
          </div>
          <div className="p-4 md:p-6 flex flex-col justify-center">
            <span className="text-xs text-muted-foreground mb-1 font-medium">Bedrooms</span>
            <span className="text-lg md:text-xl font-bold text-foreground">{bhkString}</span>
          </div>
          <div className="p-4 md:p-6 flex flex-col justify-center">
            <span className="text-xs text-muted-foreground mb-1 font-medium">Status</span>
            <span className="text-lg md:text-xl font-bold text-foreground">{derivedStatus.replace(/_/g, " ")}</span>
          </div>
          <div className="p-4 md:p-6 flex flex-col justify-center">
            <span className="text-xs text-muted-foreground mb-1 font-medium">Square Feet</span>
            <span className="text-lg md:text-xl font-bold text-foreground">{areaString}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mt-8 items-start">
          {/* Main Content */}
          <section className="flex-1 w-full min-w-0">

            <FadeIn delay={0.1} className="mb-10">
              <h2 className="font-sans text-[22px] md:text-2xl mb-6 text-foreground font-semibold">Pricing & Floor Plans</h2>
              <div className="flex flex-col gap-6">
                {project.configurations.map((cfg: any) => {
                  const price = cfg.carpetArea * cfg.pricePerSqft;
                  const firstFloorPlan = cfg.floorPlans?.[0];
                  
                  return (
                    <div key={cfg.id} className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row">
                      <div className="flex-1 p-6">
                        <h3 className="font-sans text-lg font-semibold text-foreground mb-1">{cfg.bhk} BHK {cfg.variantName}</h3>
                        <div className="font-medium text-foreground mb-4">{formatInr(price)}</div>
                        <div className="text-sm text-muted-foreground mb-6">
                          {cfg.bhk} beds, {cfg.carpetArea} sq ft<br />
                          {cfg.status && cfg.status !== derivedStatus && (
                            <span className="text-primary font-medium mt-1 inline-block">{cfg.status.replace(/_/g, " ")}</span>
                          )}
                        </div>
                        
                        <div className="flex gap-4">
                          {firstFloorPlan ? (
                            <a href={firstFloorPlan.url} target="_blank" rel="noopener noreferrer" className="border border-primary text-primary px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/5 transition-colors no-underline">
                              Tour Floor Plan
                            </a>
                          ) : (
                            <button className="border border-primary text-primary px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/5 transition-colors opacity-50 cursor-not-allowed">
                              Tour Floor Plan
                            </button>
                          )}
                          <a href={enquireUrl} target="_blank" rel="noopener noreferrer" className="text-primary font-medium text-sm py-2 hover:underline flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                            Floor Plans
                          </a>
                        </div>
                        
                        <div className="mt-8">
                          <button className="text-primary font-medium text-sm flex items-center gap-1 hover:underline">
                            Show Floor Plan Details
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                          </button>
                          
                          <div className="mt-4 pt-4 border-t border-border w-full overflow-x-auto">
                            <h4 className="text-sm font-semibold text-foreground mb-3">Available Unit</h4>
                            <table className="w-full text-sm text-left whitespace-nowrap min-w-[400px]">
                              <thead>
                                <tr className="text-muted-foreground border-b border-border">
                                  <th className="py-2 font-normal w-1/3">Price</th>
                                  <th className="py-2 font-normal w-1/3">Sq Ft</th>
                                  <th className="py-2 font-normal w-1/3">Availability</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="py-3 font-medium text-foreground">{formatInr(price)}</td>
                                  <td className="py-3 text-foreground">{cfg.carpetArea}</td>
                                  <td className="py-3 text-foreground">{cfg.status ? cfg.status.replace(/_/g, " ") : "Available"}</td>
                                </tr>
                              </tbody>
                            </table>
                            <div className="mt-4">
                              <a href={enquireUrl} target="_blank" rel="noopener noreferrer" className="border border-primary text-primary px-6 py-2 rounded-md font-medium text-sm hover:bg-primary/5 transition-colors inline-block no-underline">
                                Apply Now
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {firstFloorPlan && (
                        <div className="w-full md:w-[250px] p-6 flex items-center justify-center bg-muted/20">
                           <div className="relative w-full h-[200px] rounded-lg overflow-hidden border border-border shadow-sm">
                             <Image src={firstFloorPlan.url} alt={firstFloorPlan.label} fill className="object-cover" />
                           </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </FadeIn>

            {project.description && (
              <FadeIn delay={0.2} className="mb-10 pb-8 border-b border-border">
                <h2 className="font-sans text-[22px] md:text-2xl mb-4 text-foreground font-semibold">About</h2>
                <div className="text-base text-foreground whitespace-pre-wrap leading-relaxed">
                  {project.description}
                </div>
              </FadeIn>
            )}

            {amenitiesList.length > 0 && (
              <FadeIn delay={0.3} className="mb-10 pb-8 border-b border-border">
                <h2 className="font-sans text-[22px] md:text-2xl mb-6 text-foreground font-semibold">Community Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {amenitiesList.slice(0, 8).map((a: string) => (
                    <div key={a} className="bg-card border border-border rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3 shadow-sm hover:border-primary/50 transition-colors">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-muted-foreground">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium text-foreground">{a}</span>
                    </div>
                  ))}
                </div>
                
                {amenitiesList.length > 4 && (
                   <div>
                     <h3 className="font-sans text-lg font-semibold text-foreground mb-4">Highlights</h3>
                     <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 list-disc pl-5">
                       {amenitiesList.map((a: string) => (
                         <li key={`li-${a}`} className="text-sm text-foreground">{a}</li>
                       ))}
                     </ul>
                   </div>
                )}
              </FadeIn>
            )}

            <FadeIn delay={0.4} className="mb-10 pb-8 border-b border-border">
              <h2 className="font-sans text-[22px] md:text-2xl mb-6 text-foreground font-semibold">Location</h2>
              <div className="text-base font-medium text-foreground mb-4 flex items-center justify-between">
                <span>Property Address: <span className="font-normal text-muted-foreground">{project.location}, {project.city}</span></span>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(`${project.name}, ${project.location}, ${project.city}`)}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm font-normal">
                  Get Directions
                </a>
              </div>
              <div className="w-full h-[300px] bg-muted/50 rounded-xl border border-border flex items-center justify-center mb-6 relative overflow-hidden">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-muted-foreground opacity-50 z-10"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l1.373 1.373v57.254l-1.373 1.373H5.373L4 58.627V1.373L5.373 0h49.254zm-2.08 2H7.453v56h45.094V2zm-4.484 7.03c.53.53.53 1.39 0 1.92l-37 37c-.53.53-1.39.53-1.92 0-.53-.53-.53-1.39 0-1.92l37-37c.53-.53 1.39-.53 1.92 0zm-35.08 0c.53-.53 1.39-.53 1.92 0l37 37c.53.53.53 1.39 0 1.92-.53.53-1.39.53-1.92 0l-37-37c-.53-.53-.53-1.39 0-1.92z\' fill=\'%239C92AC\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}></div>
              </div>
              
              <h3 className="font-sans text-lg font-semibold text-foreground mb-3">City - {project.city}</h3>
              <p className="text-sm text-foreground leading-relaxed">
                {project.city} is a vibrant and developing area offering excellent connectivity, modern infrastructure, and a host of conveniences. Finding your next home here means being close to entertainment, shopping, and essential services, ensuring a dynamic atmosphere away from the noise and congestion, yet still connected.
              </p>
            </FadeIn>

            {project.documents && project.documents.length > 0 && (
              <FadeIn delay={0.5} className="mb-12">
                <h2 className="font-sans text-[22px] md:text-2xl mb-6 text-foreground font-semibold">Project Documents</h2>
                <div className="flex flex-wrap gap-4">
                  {project.documents.map((doc: any) => (
                    <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer" className="bg-card border border-border flex items-center gap-3 p-4 rounded-xl no-underline text-foreground transition-all hover:border-primary hover:shadow-sm">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-primary">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div className="font-medium text-sm">{doc.name}</div>
                    </a>
                  ))}
                </div>
              </FadeIn>
            )}
          </section>

          {/* Sticky Sidebar */}
          <aside className="w-full md:w-[350px] flex-shrink-0 sticky top-[100px] self-start z-10">
            <div className="bg-card border border-border shadow-sm rounded-xl p-6">
              <div className="font-sans text-xl font-semibold mb-6 text-center text-foreground">Contact property</div>
              
              <div className="flex flex-col gap-3 mb-6">
                <a href={enquireUrl} target="_blank" rel="noopener noreferrer" className="bg-primary/10 hover:bg-primary/20 text-primary font-medium text-center py-3 rounded-md transition-colors w-full no-underline">
                  Request Tour
                </a>
                <a href={enquireUrl} target="_blank" rel="noopener noreferrer" className="border border-primary/30 hover:border-primary text-primary font-medium text-center py-3 rounded-md transition-colors w-full no-underline">
                  Send Message
                </a>
              </div>
              
              <div className="flex flex-col items-center justify-center gap-1 pb-6 border-b border-border/60">
                <a href={`tel:${waNumber}`} className="text-primary font-semibold text-lg flex items-center gap-2 hover:underline">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  {waNumber}
                </a>
              </div>

              <div className="pt-4 flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  Language: English
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Open Hours 9am - 6pm
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
