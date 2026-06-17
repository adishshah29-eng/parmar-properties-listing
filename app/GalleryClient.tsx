"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('./components/LeafletMap'), { ssr: false });

function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function GalleryClient({ projects }: { projects: any[] }) {
  const [view, setView] = useState<"gallery" | "map">("gallery");
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const cities = useMemo(() => ["All", ...Array.from(new Set(projects.map(p => p.city)))], [projects]);
  const developers = useMemo(() => ["All", ...Array.from(new Set(projects.map(p => p.developer.name)))], [projects]);
  const statuses = useMemo(() => ["All", "READY_TO_MOVE", "UNDER_CONSTRUCTION", "NEW_LAUNCH", "SOLD_OUT"], []);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchCity = selectedCity === "All" || p.city === selectedCity;
      const matchDev = selectedDeveloper === "All" || p.developer.name === selectedDeveloper;
      const matchStatus = selectedStatus === "All" || p.derivedStatus === selectedStatus;
      return matchCity && matchDev && matchStatus;
    });
  }, [projects, selectedCity, selectedDeveloper, selectedStatus]);

  const renderProjectGrid = (isSplit = false) => (
    <div className="gallery-grid" style={{ gridTemplateColumns: isSplit ? "repeat(auto-fill, minmax(280px, 1fr))" : undefined }}>
      {filteredProjects.length === 0 ? (
        <div style={{ gridColumn: "1 / -1", padding: "64px 20px", textAlign: "center", background: "var(--bg-surface)", borderRadius: "24px" }}>
          <div style={{ fontSize: "22px", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, margin: "0 0 8px 0" }}>No properties found</div>
          <div style={{ color: "var(--text-muted)", fontSize: "16px" }}>Try adjusting your search filters to find what you're looking for.</div>
        </div>
      ) : (
        filteredProjects.map((project) => {
          const projectImage = project.images?.length > 0 ? project.images[0].url : "";
          
          let minPrice = Infinity;
          let maxPrice = -Infinity;
          if (project.configurations) {
            project.configurations.forEach((cfg: any) => {
              const price = cfg.carpetArea * cfg.pricePerSqft;
              if (price < minPrice) minPrice = price;
              if (price > maxPrice) maxPrice = price;
            });
          }

          let priceText = "Price on request";
          if (minPrice !== Infinity && maxPrice !== -Infinity) {
            if (minPrice === maxPrice) {
              priceText = formatInr(minPrice);
            } else {
              priceText = `${formatInr(minPrice)} – ${formatInr(maxPrice)}`;
            }
          }

          return (
            <Link href={`/projects/${project.slug}`} key={project.id} className="project-card">
              <div className="pc-image">
                <div className="pc-badge-floating">
                  {project.derivedStatus.replace(/_/g, " ")}
                </div>
                {projectImage ? (
                  <img src={projectImage} alt={project.name} />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6M9 12h.01M15 12h.01M9 9h.01M15 9h.01"/></svg>
                )}
              </div>
              <div className="pc-body">
                <div className="pc-dev">{project.developer.name}</div>
                <div className="pc-title">{project.name}</div>
                <div className="pc-location">{project.location}, {project.city}</div>
                <div className="pc-price">{priceText}</div>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );

  return (
    <div className="body-area" style={{ padding: "32px 0 0 0" }}>
      <div className="wrap" style={{ background: "rgba(255,255,255,0)", paddingTop: "24px", paddingBottom: "16px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
          <div>
            <h1 style={{ margin: "0 0 8px 0", fontSize: "36px", letterSpacing: "-0.5px" }}>Find Your Next Property</h1>
            <div style={{ color: "var(--text-muted)", fontSize: "16px" }}>
              Browse curated developments from leading builders. <span style={{ fontWeight: 600, color: "var(--text-dark)", marginLeft: "8px", background: "var(--bg-surface)", padding: "4px 12px", borderRadius: "99px", fontSize: "14px" }}>{filteredProjects.length} available</span>
            </div>
          </div>
          
          <div style={{ display: "flex", background: "var(--bg-surface)", padding: "4px", borderRadius: "99px", border: "1px solid var(--border-light)" }}>
            <button onClick={() => setView("gallery")} style={{ background: view === "gallery" ? "#fff" : "transparent", border: "none", padding: "10px 24px", borderRadius: "99px", fontWeight: view === "gallery" ? 600 : 500, color: view === "gallery" ? "var(--text-dark)" : "var(--text-muted)", cursor: "pointer", boxShadow: view === "gallery" ? "0 2px 8px rgba(0,0,0,0.05)" : "none", transition: "all 0.2s" }}>
              Gallery
            </button>
            <button onClick={() => setView("map")} style={{ background: view === "map" ? "#fff" : "transparent", border: "none", padding: "10px 24px", borderRadius: "99px", fontWeight: view === "map" ? 600 : 500, color: view === "map" ? "var(--text-dark)" : "var(--text-muted)", cursor: "pointer", boxShadow: view === "map" ? "0 2px 8px rgba(0,0,0,0.05)" : "none", transition: "all 0.2s" }}>
              Map View
            </button>
          </div>
        </div>

        <div className="collection-chips">
          {cities.map(c => (
            <button 
              key={c} 
              className={`chip ${selectedCity === c ? 'active' : ''}`}
              onClick={() => setSelectedCity(c)}
            >
              {c === "All" ? "All Cities" : c}
            </button>
          ))}
          {developers.length > 2 && developers.map(d => (
            <button 
              key={d} 
              className={`chip ${selectedDeveloper === d ? 'active' : ''}`}
              onClick={() => setSelectedDeveloper(d)}
            >
              {d === "All" ? "All Developers" : d}
            </button>
          ))}
          {statuses.map(s => (
            <button 
              key={s} 
              className={`chip ${selectedStatus === s ? 'active' : ''}`}
              onClick={() => setSelectedStatus(s)}
            >
              {s === "All" ? "All Statuses" : s.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {view === "map" ? (
        <div style={{ display: "flex", height: "calc(100vh - 280px)", borderTop: "1px solid var(--border-light)" }}>
          <div style={{ width: "50%", overflowY: "auto", padding: "24px", background: "var(--bg-surface)" }}>
            {renderProjectGrid(true)}
          </div>
          <div style={{ width: "50%", position: "relative" }}>
            <LeafletMap projects={filteredProjects} />
          </div>
        </div>
      ) : (
        <div className="wrap" style={{ paddingTop: "24px" }}>
          {renderProjectGrid()}
        </div>
      )}
    </div>
  );
}
