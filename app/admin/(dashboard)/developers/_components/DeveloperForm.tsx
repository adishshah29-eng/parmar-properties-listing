"use client";

import { useState } from "react";
import { createDeveloper } from "../actions";
import { Image as ImageIcon, Loader2 } from "lucide-react";

export default function DeveloperForm() {
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setErrorMsg("");
    const res = await createDeveloper(formData, logoUrl);
    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      // success, handled by form reset if needed, but page revalidates anyway
    }
    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-6">
      <div>
        <label className="block mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Name</label>
        <input 
          name="name" 
          type="text" 
          required 
          placeholder="e.g. Parmar Group"
          className="w-full bg-background/50 border border-border text-sm px-4 py-3 outline-none focus:border-primary focus:bg-background transition-all duration-300 rounded-xl"
        />
      </div>
      <div>
        <label className="block mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Website</label>
        <input 
          name="website" 
          type="url" 
          placeholder="https://..." 
          className="w-full bg-background/50 border border-border text-sm px-4 py-3 outline-none focus:border-primary focus:bg-background transition-all duration-300 rounded-xl"
        />
      </div>
      <div>
        <label className="block mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Upload Logo</label>
        <div className="relative flex flex-col items-center justify-center p-8 bg-background/30 border border-dashed border-border/60 hover:bg-background/50 hover:border-primary/50 transition-all duration-300 rounded-xl overflow-hidden group">
          <input 
            type="file" 
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
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
          <div className="flex flex-col items-center gap-3 pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <ImageIcon size={18} />
            </div>
            <div className="text-sm font-medium">Click to choose image</div>
            <div className="text-xs text-muted-foreground">{logoUrl ? "Logo ready to save" : "PNG, JPG up to 2MB"}</div>
          </div>
        </div>
        {logoUrl && <div className="text-xs font-medium text-primary mt-2">Uploaded: {logoUrl}</div>}
      </div>
      <div>
        <label className="block mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Established Year</label>
        <input 
          name="established" 
          type="number" 
          placeholder="1994" 
          className="w-full bg-background/50 border border-border text-sm px-4 py-3 outline-none focus:border-primary focus:bg-background transition-all duration-300 rounded-xl"
        />
      </div>
      <div className="pt-2">
        <button 
          type="submit" 
          disabled={loading}
          className="w-full flex items-center justify-center bg-foreground text-background text-sm font-semibold py-3.5 hover:bg-foreground/90 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-foreground/20 transition-all duration-300 rounded-xl disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin mr-2" />
              Creating...
            </>
          ) : "Create Developer"}
        </button>
      </div>
      {errorMsg && <div className="text-sm text-destructive font-medium p-3 bg-destructive/10 rounded-lg">{errorMsg}</div>}
    </form>
  );
}
