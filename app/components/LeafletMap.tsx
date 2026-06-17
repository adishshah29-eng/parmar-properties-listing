"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import { useEffect } from "react";

const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

export default function LeafletMap({ projects }: { projects: any[] }) {
  const center: [number, number] = [19.0760, 72.8777]; // Default to Mumbai

  return (
    <div style={{ height: "60vh", width: "100%", borderRadius: "12px", overflow: "hidden", zIndex: 0 }}>
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
  );
}
