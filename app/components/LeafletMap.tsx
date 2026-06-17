"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import { useEffect } from "react";

const customIcon = L.divIcon({
  html: `
    <div style="background-color: var(--accent); width: 24px; height: 24px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 4px 12px rgba(14,116,144,0.4); display: flex; align-items: center; justify-content: center;">
      <div style="background-color: #fff; width: 6px; height: 6px; border-radius: 50%;"></div>
    </div>
  `,
  className: 'custom-map-marker',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -14],
});

L.Marker.prototype.options.icon = customIcon;

export default function LeafletMap({ projects }: { projects: any[] }) {
  const center: [number, number] = [19.0760, 72.8777]; // Default to Mumbai

  return (
    <div className="glass-strong" style={{ height: "100%", width: "100%", borderRadius: "24px", overflow: "hidden", zIndex: 0, padding: "8px" }}>
      <div style={{ height: "100%", width: "100%", borderRadius: "16px", overflow: "hidden" }}>
        <MapContainer center={center} zoom={11} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {projects.map((p) => {
          if (!p.latitude || !p.longitude) return null;
          return (
            <Marker key={p.id} position={[p.latitude, p.longitude]}>
              <Popup>
                <div style={{ padding: "4px" }}>
                  <div className="serif" style={{ fontSize: "16px", marginBottom: "4px" }}>{p.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>{p.location}</div>
                  <Link href={`/projects/${p.slug}`} style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
                    View Gallery &rarr;
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
        </MapContainer>
      </div>
    </div>
  );
}
