"use client";

import { useState, useEffect } from "react";
import { updateSettings } from "../actions";

export default function SettingsClient() {
  const [waNumber, setWaNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(d => {
        if (d && d.whatsappNumber) setWaNumber(d.whatsappNumber);
      })
      .catch(() => {}); // ignore
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      await updateSettings(waNumber);
      setMsg("Settings saved successfully.");
    } catch (err: any) {
      setMsg(err.message || "Failed to save settings.");
    }
    setLoading(false);
  }

  return (
    <div className="detail-body" style={{ padding: "48px 48px" }}>
      <div className="panel-card" style={{ maxWidth: "600px", height: "auto" }}>
        <div className="panel-head">
          <div style={{ fontSize: "16px", fontWeight: 600 }}>Site Settings</div>
        </div>
        <div style={{ padding: "20px" }}>
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>WhatsApp Number</label>
              <input 
                type="text" 
                value={waNumber} 
                onChange={e => setWaNumber(e.target.value)} 
                placeholder="e.g. 919876543210 (include country code, no +, no spaces)"
                required
              />
              <div style={{ fontSize: "12px", color: "var(--admin-text-muted)", marginTop: "4px" }}>
                This number will be used for all "Enquire" buttons across the gallery.
              </div>
            </div>
            <div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Save Settings"}
              </button>
            </div>
            {msg && <div style={{ fontSize: "14px", color: msg.includes("success") ? "var(--admin-green)" : "var(--admin-red)" }}>{msg}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
