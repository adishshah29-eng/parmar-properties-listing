import { createClient } from "@/lib/supabase/server";
import { getProjectStatus } from "@/lib/project-status";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { notFound } from "next/navigation";
import ImageGalleryClient from "./ImageGalleryClient";

function formatInr(value: number) {
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
  const contactUrl = buildWhatsAppLink(waNumber, project.name);

  const derivedStatus = getProjectStatus(project.configurations);

  const amenitiesList = project.amenities ? project.amenities.split(',').map(s => s.trim()).filter(Boolean) : [];

  return (
    <div className="body-area" style={{ paddingBottom: "100px", paddingTop: "24px" }}>
      <div className="wrap">
        
        {/* Header Section */}
        <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              {project.developer.logoUrl && (
                <img src={project.developer.logoUrl} alt={project.developer.name} style={{ height: "40px", borderRadius: "8px" }} />
              )}
              <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
                {project.developer.name}
              </span>
            </div>
            <h1 style={{ fontSize: "48px", margin: "0 0 8px 0", letterSpacing: "-1px" }}>{project.name}</h1>
            <div style={{ fontSize: "16px", color: "var(--text-muted)", textDecoration: "underline", cursor: "pointer" }}>{project.location}, {project.city}</div>
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
            
            <div style={{ paddingBottom: "32px", borderBottom: "1px solid var(--border-light)", marginBottom: "32px" }}>
               <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>Property Overview</h2>
               <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                 <div>
                   <div style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "4px" }}>Status</div>
                   <div className={`pc-badge-floating`} style={{ position: "static", display: "inline-block", background: "var(--status-ready-bg)", color: "var(--status-ready-text)", boxShadow: "none", border: "1px solid rgba(0,0,0,0.05)" }}>{derivedStatus.replace(/_/g, " ")}</div>
                 </div>
               </div>
            </div>

            {project.description && (
              <div style={{ paddingBottom: "32px", borderBottom: "1px solid var(--border-light)", marginBottom: "32px" }}>
                <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>About this property</h2>
                <div style={{ fontSize: "16px", color: "var(--text-dark)", whiteSpace: "pre-wrap", lineHeight: 1.8 }}>
                  {project.description}
                </div>
              </div>
            )}

            {amenitiesList.length > 0 && (
              <div style={{ paddingBottom: "32px", borderBottom: "1px solid var(--border-light)", marginBottom: "32px" }}>
                <h2 style={{ fontSize: "24px", marginBottom: "24px" }}>What this place offers</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {amenitiesList.map(a => (
                    <div key={a} style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "16px", color: "var(--text-dark)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "24px", height: "24px", color: "var(--text-dark)" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ paddingBottom: "32px", borderBottom: "1px solid var(--border-light)", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "24px", marginBottom: "24px" }}>Configurations</h2>
              <div className="table-wrapper">
                <table style={{ border: "none" }}>
                  <thead>
                    <tr>
                      <th style={{ background: "transparent", borderBottom: "1px solid var(--border-light)" }}>Type</th>
                      <th style={{ background: "transparent", borderBottom: "1px solid var(--border-light)" }}>Carpet Area</th>
                      <th style={{ background: "transparent", borderBottom: "1px solid var(--border-light)" }}>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.configurations.map(cfg => {
                      const price = cfg.carpetArea * cfg.pricePerSqft;
                      return (
                        <tr key={cfg.id}>
                          <td style={{ borderBottom: "1px solid var(--border-light)" }}><div style={{ fontWeight: 600 }}>{cfg.bhk} BHK</div><div style={{ fontSize: "14px", color: "var(--text-muted)" }}>{cfg.variantName}</div></td>
                          <td style={{ borderBottom: "1px solid var(--border-light)" }}>{cfg.carpetArea} sq.ft.</td>
                          <td style={{ fontWeight: 600, borderBottom: "1px solid var(--border-light)" }}>{formatInr(price)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {project.configurations.some(c => c.floorPlans.length > 0) && (
              <div style={{ marginBottom: "48px" }}>
                <h2 style={{ fontSize: "24px", marginBottom: "24px" }}>Floor Plans</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px" }}>
                  {project.configurations.map(cfg => (
                    cfg.floorPlans.map(fp => (
                      <a href={fp.url} target="_blank" rel="noopener noreferrer" key={fp.id} style={{ display: "block", background: "#fff", border: "1px solid var(--border-light)", borderRadius: "16px", overflow: "hidden", textDecoration: "none", transition: "transform 0.2s" }}>
                        <div style={{ height: "180px", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "var(--bg-surface)" }}>
                          <img src={fp.url} alt={fp.label} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))" }} />
                        </div>
                        <div style={{ padding: "16px", fontSize: "16px", fontWeight: 600, color: "var(--text-dark)" }}>
                          {cfg.bhk} BHK - {fp.label}
                        </div>
                      </a>
                    ))
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Sticky Sidebar */}
          <aside style={{ flex: "1 1 30%", minWidth: "300px" }}>
            <div style={{ position: "sticky", top: "100px", background: "#fff", border: "1px solid var(--border-light)", borderRadius: "24px", padding: "24px", boxShadow: "0 6px 24px rgba(0,0,0,0.08)" }}>
              <div style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px", color: "var(--text-dark)" }}>Interested?</div>
              <div style={{ fontSize: "16px", color: "var(--text-muted)", marginBottom: "24px" }}>Get in touch for pricing, availability, and a private viewing.</div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <a href={contactUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: "100%", textDecoration: "none" }}>
                  Enquire Now
                </a>
                <a href={contactUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ width: "100%", textDecoration: "none" }}>
                  Book Site Visit
                </a>
                <a href={contactUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ width: "100%", textDecoration: "none" }}>
                  Call Now
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
