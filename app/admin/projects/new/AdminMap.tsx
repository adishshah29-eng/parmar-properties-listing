"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

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
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = defaultIcon;

function LocationMarker({ position, onChange }: { position: [number, number], onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
}

export default function AdminMap({ lat, lng, onChange }: { lat: number, lng: number, onChange: (lat: number, lng: number) => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div style={{ height: "300px", width: "100%", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--admin-border)", zIndex: 0 }}>
      <MapContainer center={[lat, lng]} zoom={11} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OSM'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={[lat, lng]} onChange={onChange} />
      </MapContainer>
      <div style={{ fontSize: "11px", color: "var(--admin-text-muted)", marginTop: "4px" }}>
        Click on the map to set the exact project location pin.
      </div>
    </div>
  );
}
