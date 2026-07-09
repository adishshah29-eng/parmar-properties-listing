"use client";

import { useState } from "react";
import { updateInventoryStatus } from "../actions";
import FadeIn from "@/components/common/FadeIn";
import { Building2, Search, Filter, Hash, Layers, Compass, Tag, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";

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

  const statusColors: Record<string, string> = {
    AVAILABLE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    BOOKED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    HOLD: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    SOLD: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  };

  return (
    <div className="pb-20">
      <FadeIn>
        <h1 className="text-4xl font-serif font-medium tracking-tight mb-2">Inventory</h1>
        <p className="text-muted-foreground mb-12">Manage real-time unit availability and pricing.</p>
      </FadeIn>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <FadeIn delay={0.2} className="w-full lg:w-80 shrink-0 sticky top-8">
          <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-3xl overflow-hidden shadow-xl shadow-black/5">
            <div className="p-5 border-b border-border/50 bg-muted/30">
              <h2 className="font-serif text-lg font-medium">Configurations</h2>
            </div>
            <div className="p-4 flex flex-col gap-6 max-h-[calc(100vh-250px)] overflow-y-auto no-scrollbar">
              {projects.map(p => (
                <div key={p.id}>
                  <div className="flex items-center gap-2 mb-3 px-2 text-foreground font-medium">
                    <Building2 size={16} className="text-primary" />
                    <span>{p.name}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {p.configurations.map((c: any) => {
                      const isSelected = selectedConfig?.id === c.id;
                      return (
                        <button
                          key={c.id}
                          onClick={() => setSelectedConfigId(c.id)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                            isSelected 
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" 
                              : "bg-background/40 hover:bg-background/80 text-muted-foreground hover:text-foreground border border-transparent hover:border-border/50"
                          }`}
                        >
                          <span className="truncate">{c.bhk} BHK {c.variantName}</span>
                          <ChevronRight size={14} className={isSelected ? "opacity-100" : "opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0"} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
        
        <FadeIn delay={0.4} className="flex-1 w-full">
          <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-3xl shadow-xl shadow-black/5 overflow-hidden min-h-[500px] flex flex-col">
            <div className="p-6 border-b border-border/50 bg-muted/30 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-medium">
                  {selectedConfig ? `${selectedConfig.bhk} BHK ${selectedConfig.variantName}` : "Select a Configuration"}
                </h2>
                {selectedConfig && <p className="text-sm text-muted-foreground mt-1">Manage units for this configuration.</p>}
              </div>
            </div>
            
            <div className="flex-1 p-6">
              {!selectedConfig ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-12">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                    <Search size={24} className="opacity-50" />
                  </div>
                  <p>Select a configuration from the sidebar to manage its inventory.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="pb-4 font-semibold text-[10px] uppercase tracking-[0.15em] text-muted-foreground border-b border-border/50">Unit</th>
                        <th className="pb-4 font-semibold text-[10px] uppercase tracking-[0.15em] text-muted-foreground border-b border-border/50">Floor</th>
                        <th className="pb-4 font-semibold text-[10px] uppercase tracking-[0.15em] text-muted-foreground border-b border-border/50">Facing</th>
                        <th className="pb-4 font-semibold text-[10px] uppercase tracking-[0.15em] text-muted-foreground border-b border-border/50">Price Override</th>
                        <th className="pb-4 font-semibold text-[10px] uppercase tracking-[0.15em] text-muted-foreground border-b border-border/50">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedConfig.inventory.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                            No units found for this configuration.
                          </td>
                        </tr>
                      ) : (
                        selectedConfig.inventory.map((inv: any) => (
                          <tr key={inv.id} className="group border-b border-border/30 last:border-b-0 hover:bg-muted/20 transition-colors">
                            <td className="py-4 font-medium flex items-center gap-2">
                              <Hash size={14} className="text-muted-foreground" />
                              {inv.unitNumber}
                            </td>
                            <td className="py-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1.5"><Layers size={14} /> {inv.floor}</div>
                            </td>
                            <td className="py-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1.5"><Compass size={14} /> {inv.facing || "-"}</div>
                            </td>
                            <td className="py-4 font-mono text-sm">
                              {inv.priceOverride ? `₹${inv.priceOverride.toLocaleString()}` : <span className="text-muted-foreground/50">-</span>}
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <select 
                                  value={inv.status} 
                                  onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                                  disabled={saving === inv.id}
                                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border outline-none appearance-none cursor-pointer transition-all ${statusColors[inv.status] || "bg-background border-border"} focus:ring-2 focus:ring-primary/20 disabled:opacity-50`}
                                >
                                  <option value="AVAILABLE">Available</option>
                                  <option value="BOOKED">Booked</option>
                                  <option value="HOLD">Hold</option>
                                  <option value="SOLD">Sold</option>
                                </select>
                                {saving === inv.id && <Loader2 size={14} className="animate-spin text-muted-foreground" />}
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
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
