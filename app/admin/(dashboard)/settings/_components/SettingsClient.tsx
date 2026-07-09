"use client";

import { useState, useEffect } from "react";
import { updateSettings } from "../actions";
import { MessageCircle, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function SettingsClient() {
  const [waNumber, setWaNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);

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
    setIsError(false);
    try {
      await updateSettings(waNumber);
      setMsg("Settings saved successfully.");
    } catch (err: any) {
      setIsError(true);
      setMsg(err.message || "Failed to save settings.");
    }
    setLoading(false);
  }

  return (
    <div className="bg-card/60 backdrop-blur-md border border-border/60 p-6 md:p-8 rounded-3xl shadow-xl shadow-black/5 max-w-2xl">
      <h2 className="text-xl font-serif font-medium mb-6">WhatsApp Integration</h2>
      
      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <div>
          <label className="block mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">WhatsApp Number</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MessageCircle size={16} className="text-muted-foreground" />
            </div>
            <input 
              type="text" 
              value={waNumber} 
              onChange={e => setWaNumber(e.target.value)} 
              placeholder="e.g. 919876543210"
              required
              className="w-full bg-background/50 border border-border text-sm pl-11 pr-4 py-3 outline-none focus:border-primary focus:bg-background transition-all duration-300 rounded-xl"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-primary/50"></span>
            Include country code, no "+" sign or spaces. Used for all "Enquire" buttons.
          </p>
        </div>
        
        <div className="pt-2">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full md:w-auto px-8 flex items-center justify-center gap-2 bg-foreground text-background text-sm font-semibold py-3.5 hover:bg-foreground/90 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-foreground/20 transition-all duration-300 rounded-xl disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </div>
        
        {msg && (
          <div className={`flex items-center gap-2 text-sm font-medium p-4 rounded-xl ${isError ? 'bg-destructive/10 text-destructive' : 'bg-emerald-500/10 text-emerald-600'}`}>
            {isError ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            {msg}
          </div>
        )}
      </form>
    </div>
  );
}
