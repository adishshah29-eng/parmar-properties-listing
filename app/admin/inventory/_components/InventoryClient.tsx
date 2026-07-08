"use client";

import { useState } from "react";
import { updateInventoryStatus } from "../actions";

export default function InventoryClient({ projects }: { projects: any[] }) {
  const [selectedConfigId, setSelectedConfigId] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  // We need to find the selected config from the projects to ensure it updates when revalidated
  let selectedConfig = null;
  if (selectedConfigId) {
    for (const p of projects) {
      const cfg = p.configurations.find((c: any) => c.id === selectedConfigId);
      if (cfg) {
        selectedConfig = cfg;
        break;
      }
    }
  }

  async function handleStatusChange(unitId: string, status: string) {
    setSaving(unitId);
    await updateInventoryStatus(unitId, status);
    setSaving(null);
  }

  return (
    <div style={{ display: "flex", gap: "24px", minHeight: "calc(100vh - 96px)", padding: "48px 48px" }}>
      <aside className="panel-card" style={{ flex: "0 0 320px", height: "auto" }}>
        <div className="panel-head">Projects</div>
        <div className="tree-body">
          {projects.map(p => (
            <div key={p.id} style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>{p.name}</div>
              {p.configurations.map((c: any) => (
                <div 
                  key={c.id} 
                  className={`tree-row ${selectedConfig?.id === c.id ? "selected" : ""}`}
                  onClick={() => setSelectedConfigId(c.id)}
                >
                  <span className="tree-badge cfg">CFG</span>
                  <span style={{ fontSize: "12px" }}>{c.bhk} BHK {c.variantName}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </aside>
      
      <section className="panel-card" style={{ flex: 1, height: "100%" }}>
        <div className="panel-head">
          <div style={{ fontWeight: 600 }}>
            {selectedConfig ? `Inventory: ${selectedConfig.bhk} BHK ${selectedConfig.variantName}` : "Select a Configuration"}
          </div>
        </div>
        <div className="detail-body">
          {!selectedConfig ? (
            <div className="empty-state">Select a configuration to manage its inventory.</div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Unit</th>
                    <th>Floor</th>
                    <th>Facing</th>
                    <th>Price Override</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedConfig.inventory.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: "center", padding: "16px", color: "var(--admin-text-muted)" }}>No units found.</td></tr>
                  ) : (
                    selectedConfig.inventory.map((inv: any) => (
                      <tr key={inv.id}>
                        <td style={{ fontWeight: 600 }}>{inv.unitNumber}</td>
                        <td>{inv.floor}</td>
                        <td>{inv.facing || "-"}</td>
                        <td>{inv.priceOverride ? `₹${inv.priceOverride.toLocaleString()}` : "-"}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <select 
                              value={inv.status} 
                              onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                              disabled={saving === inv.id}
                              style={{ padding: "4px 8px", fontSize: "12px", width: "auto" }}
                            >
                              <option value="AVAILABLE">Available</option>
                              <option value="BOOKED">Booked</option>
                              <option value="HOLD">Hold</option>
                              <option value="SOLD">Sold</option>
                            </select>
                            {saving === inv.id && <span style={{ fontSize: "10px", color: "var(--admin-text-muted)" }}>Saving...</span>}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
