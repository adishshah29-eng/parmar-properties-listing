import { createClient } from "@/lib/supabase/server";
import { getProjectStatus } from "@/lib/project-status";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { notFound } from "next/navigation";
import ImageGalleryClient from "./ImageGalleryClient";
import { Metadata } from "next";
import Image from "next/image";
import FadeIn from "../../../components/FadeIn";

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
        <div className="mb-10 flex justify-between items-end flex-wrap gap-4">
          <div>
            <div className="glass-chip inline-flex items-center gap-3 mb-5 px-4 py-1.5 pl-1.5 rounded-full">
              {project.developer.logoUrl && (
                <div className="bg-white rounded-full p-1 flex items-center justify-center">
                  <Image src={project.developer.logoUrl} alt={project.developer.name} width={60} height={24} className="h-6 w-auto object-contain" />
                </div>
              )}
              <span className="text-[13px] font-semibold text-[var(--text-dark)] uppercase tracking-wide">
                {project.developer.name}
              </span>
            </div>
            <h1 className="font-fraunces text-4xl md:text-5xl lg:text-[56px] text-[var(--text-dark)] m-0 mb-3 leading-tight">{project.name}</h1>
            <div className="text-lg text-[var(--text-muted)]">{project.location}, {project.city}</div>
          </div>
        </div>

        {/* Image Gallery */}
        {project.images.length > 0 ? (
          <ImageGalleryClient images={project.images} />
        ) : (
          <div style={{ height: "400px", background: "var(--bg-surface)", borderRadius: "24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: "48px" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: "48px", height: "48px", color: "var(--text-faint)", marginBottom: "16px" }}><path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6M9 12h.01M15 12h.01M9 9h.01M15 9h.01"/></svg>
            <span style={{ color: "var(--text-muted)", fontSize: "16px" }}>No Images Available</span>
          </div>
        )}

        <div style={{ display: "flex", gap: "48px", marginTop: "48px", alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Main Content */}
          <section style={{ flex: "1 1 60%", minWidth: "300px" }}>
            
            <FadeIn delay={0.1} style={{ paddingBottom: "32px", borderBottom: "1px solid var(--border-light)", marginBottom: "32px" }}>
               <h2 className="font-fraunces text-[28px] mb-4 text-[var(--text-dark)]">Property Overview</h2>
               <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                 <div>
                   <div style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "8px" }}>Status</div>
                   <div className="glass-chip" style={{ display: "inline-block", padding: "6px 16px", background: "var(--glass-bg-strong)", color: "var(--accent)" }}>{derivedStatus.replace(/_/g, " ")}</div>
                 </div>
               </div>
            </FadeIn>

            {project.description && (
              <FadeIn delay={0.2} className="pb-8 border-b border-[var(--border-light)] mb-8">
                <h2 className="font-fraunces text-2xl md:text-[28px] mb-4 text-[var(--text-dark)]">About this property</h2>
                <div className="text-base text-[var(--text-dark)] whitespace-pre-wrap leading-relaxed">
                  {project.description}
                </div>
              </FadeIn>
            )}

            {amenitiesList.length > 0 && (
              <FadeIn delay={0.3} className="pb-8 border-b border-[var(--border-light)] mb-8">
                <h2 className="font-fraunces text-2xl md:text-[28px] mb-6 text-[var(--text-dark)]">What this place offers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {amenitiesList.map((a: string) => (
                    <div key={a} className="flex items-center gap-4 text-base text-[var(--text-dark)]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-[var(--accent)]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {a}
                    </div>
                  ))}
                </div>
              </FadeIn>
            )}

            <FadeIn delay={0.4} className="pb-8 border-b border-[var(--border-light)] mb-8">
              <h2 className="font-fraunces text-2xl md:text-[28px] mb-6 text-[var(--text-dark)]">Configurations</h2>
              <div className="table-wrapper glass">
                <table className="border-none w-full text-left">
                  <thead>
                    <tr>
                      <th className="bg-transparent border-b border-[var(--border-light)] text-[var(--text-muted)] font-semibold p-4">Type</th>
                      <th className="bg-transparent border-b border-[var(--border-light)] text-[var(--text-muted)] font-semibold p-4">Carpet Area</th>
                      <th className="bg-transparent border-b border-[var(--border-light)] text-[var(--text-muted)] font-semibold p-4">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.configurations.map((cfg: any) => {
                      const price = cfg.carpetArea * cfg.pricePerSqft;
                      return (
                        <tr key={cfg.id}>
                          <td className="border-b border-[var(--border-light)] p-4">
                            <div className="font-semibold">{cfg.bhk} BHK</div>
                            <div className="text-sm text-[var(--text-muted)]">{cfg.variantName}</div>
                            {cfg.status && cfg.status !== derivedStatus && (
                              <div className="text-xs mt-1 font-semibold text-[var(--accent)]">
                                {cfg.status.replace(/_/g, " ")}
                              </div>
                            )}
                          </td>
                          <td className="border-b border-[var(--border-light)] p-4">{cfg.carpetArea} sq.ft.</td>
                          <td className="font-semibold border-b border-[var(--border-light)] text-[var(--accent)] p-4">{formatInr(price)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </FadeIn>

            {project.configurations.some((c: any) => c.floorPlans.length > 0) && (
              <FadeIn delay={0.5} className="mb-12">
                <h2 className="font-fraunces text-2xl md:text-[28px] mb-6 text-[var(--text-dark)]">Floor Plans</h2>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
                  {project.configurations.map((cfg: any) => (
                    cfg.floorPlans.map((fp: any) => (
                      <a href={fp.url} target="_blank" rel="noopener noreferrer" key={fp.id} className="glass block rounded-2xl overflow-hidden no-underline transition-all hover:-translate-y-1 hover:shadow-lg hover:border-[var(--accent)]">
                        <div className="h-[180px] flex items-center justify-center p-6 bg-white/40 relative">
                          <Image src={fp.url} alt={fp.label} fill className="object-contain p-6 drop-shadow-md" />
                        </div>
                        <div className="p-4 text-base font-semibold text-[var(--text-dark)]">
                          {cfg.bhk} BHK - {fp.label}
                        </div>
                      </a>
                    ))
                  ))}
                </div>
              </FadeIn>
            )}

            {project.documents && project.documents.length > 0 && (
              <FadeIn delay={0.6} className="mb-12">
                <h2 className="font-fraunces text-2xl md:text-[28px] mb-6 text-[var(--text-dark)]">Project Documents</h2>
                <div className="flex flex-col gap-4">
                  {project.documents.map((doc: any) => (
                    <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer" className="glass flex items-center gap-4 p-4 rounded-2xl no-underline text-[var(--text-dark)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] hover:-translate-y-0.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div className="font-semibold">{doc.name}</div>
                    </a>
                  ))}
                </div>
              </FadeIn>
            )}
          </section>

          {/* Sticky Sidebar */}
          <aside className="w-full md:w-[350px] flex-shrink-0">
            <div className="glass-strong sticky top-[100px] rounded-3xl p-8 z-10">
              <div className="font-fraunces text-3xl mb-2 text-[var(--text-dark)]">Interested?</div>
              <div className="text-base text-[var(--text-muted)] mb-8">Get in touch for pricing, availability, and a private viewing.</div>
              
              <div className="flex flex-col gap-4">
                <a href={enquireUrl} target="_blank" rel="noopener noreferrer" className="btn-primary w-full no-underline shadow-[0_4px_12px_rgba(14,116,144,0.3)]">
                  Enquire Now
                </a>
                <a href={siteVisitUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary w-full no-underline bg-white/50">
                  Book Site Visit
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
