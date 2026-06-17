"use client";

import { useState } from "react";
import { createDeveloper } from "./actions";

export default function DeveloperForm() {
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    await createDeveloper(formData, logoUrl);
    setLoading(false);
  }

  return (
    <form action={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "var(--admin-text-muted)" }}>Name</label>
        <input name="name" type="text" required />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "var(--admin-text-muted)" }}>Website</label>
        <input name="website" type="text" placeholder="https://..." />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "var(--admin-text-muted)" }}>Upload Logo</label>
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "16px", padding: "16px", background: "var(--admin-bg-page)", border: "1px dashed var(--admin-border)", borderRadius: "16px", overflow: "hidden" }}>
          <input 
            type="file" 
            accept="image/*"
            style={{ opacity: 0, position: "absolute", top: 0, left: 0, right: 0, bottom: 0, cursor: "pointer", width: "100%", height: "100%" }}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const fd = new FormData();
              fd.append("file", file);
              try {
                const res = await fetch("/api/upload", { method: "POST", body: fd });
                const data = await res.json();
                if (data.url) setLogoUrl(data.url);
              } catch (err) {
                console.error(err);
              }
            }}
          />
          <div className="btn-secondary" style={{ pointerEvents: "none", minHeight: "36px", padding: "0 16px", fontSize: "14px" }}>Choose Image</div>
          <div style={{ fontSize: "14px", color: "var(--admin-text-muted)" }}>{logoUrl ? "Logo ready to save" : "PNG, JPG up to 2MB"}</div>
        </div>
        {logoUrl && <div style={{ fontSize: "12px", color: "var(--admin-green)", marginTop: "4px" }}>Uploaded: {logoUrl}</div>}
      </div>
      <div>
        <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "var(--admin-text-muted)" }}>Established year</label>
        <input name="established" type="number" placeholder="1978" />
      </div>
      <div style={{ marginTop: "8px" }}>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create Developer"}
        </button>
      </div>
    </form>
  );
}
