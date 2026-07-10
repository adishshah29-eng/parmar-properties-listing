"use client";

import { useState, useRef } from "react";
import { createDeveloper } from "../actions";
import { Image as ImageIcon, Loader2, CheckCircle2, X, UploadCloud } from "lucide-react";

export default function DeveloperForm() {
  const [logoUrl, setLogoUrl] = useState("");
  const [previewSrc, setPreviewSrc] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreviewSrc(objectUrl);
    setLogoUrl("");
    setUploadError("");
    setUploadLoading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok || data.error) {
        setUploadError(data.error || "Upload failed. Please try again.");
        setPreviewSrc("");
      } else {
        setLogoUrl(data.url);
      }
    } catch (err) {
      setUploadError("Network error during upload. Please try again.");
      setPreviewSrc("");
    } finally {
      setUploadLoading(false);
    }
  }

  function clearLogo() {
    setLogoUrl("");
    setPreviewSrc("");
    setUploadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setErrorMsg("");
    setSuccess(false);

    const res = await createDeveloper(formData, logoUrl || null);

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      setSuccess(true);
      formRef.current?.reset();
      clearLogo();
      setTimeout(() => setSuccess(false), 4000);
    }
    setSubmitting(false);
  }

  const isUploadPending = uploadLoading;
  const canSubmit = !submitting && !isUploadPending;

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-6">
      {/* Name */}
      <div>
        <label className="block mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          Name
        </label>
        <input
          name="name"
          type="text"
          required
          placeholder="e.g. Parmar Group"
          className="w-full bg-background/50 border border-border text-sm px-4 py-3 outline-none focus:border-primary focus:bg-background transition-all duration-300 rounded-xl"
        />
      </div>

      {/* Website */}
      <div>
        <label className="block mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          Website
        </label>
        <input
          name="website"
          type="url"
          placeholder="https://..."
          className="w-full bg-background/50 border border-border text-sm px-4 py-3 outline-none focus:border-primary focus:bg-background transition-all duration-300 rounded-xl"
        />
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          Logo
        </label>

        {previewSrc ? (
          /* Preview state */
          <div className="relative flex items-center gap-4 p-4 bg-background/40 border border-border/60 rounded-xl">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border/60 bg-muted/30 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewSrc}
                alt="Logo preview"
                className="w-full h-full object-contain"
              />
              {uploadLoading && (
                <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                  <Loader2 size={18} className="animate-spin text-primary" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              {uploadLoading ? (
                <p className="text-sm font-medium text-muted-foreground">Uploading…</p>
              ) : logoUrl ? (
                <>
                  <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                    Logo uploaded
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{logoUrl}</p>
                </>
              ) : null}
            </div>
            <button
              type="button"
              onClick={clearLogo}
              className="flex-shrink-0 w-7 h-7 rounded-full bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
              title="Remove logo"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          /* Dropzone state */
          <div className="relative flex flex-col items-center justify-center p-8 bg-background/30 border border-dashed border-border/60 hover:bg-background/50 hover:border-primary/50 transition-all duration-300 rounded-xl overflow-hidden group cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={handleFileChange}
            />
            <div className="flex flex-col items-center gap-3 pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <UploadCloud size={18} />
              </div>
              <div className="text-sm font-medium">Click to upload logo</div>
              <div className="text-xs text-muted-foreground">PNG, JPG, WebP up to 5MB</div>
            </div>
          </div>
        )}

        {/* Upload error */}
        {uploadError && (
          <p className="mt-2 text-xs text-destructive font-medium flex items-center gap-1">
            <X size={12} /> {uploadError}
          </p>
        )}
      </div>

      {/* Established Year */}
      <div>
        <label className="block mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          Established Year
        </label>
        <input
          name="established"
          type="number"
          placeholder="1994"
          className="w-full bg-background/50 border border-border text-sm px-4 py-3 outline-none focus:border-primary focus:bg-background transition-all duration-300 rounded-xl"
        />
      </div>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={!canSubmit}
          title={isUploadPending ? "Wait for logo to finish uploading" : undefined}
          className="w-full flex items-center justify-center bg-foreground text-background text-sm font-semibold py-3.5 hover:bg-foreground/90 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-foreground/20 transition-all duration-300 rounded-xl disabled:opacity-50 disabled:pointer-events-none"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin mr-2" />
              Creating…
            </>
          ) : isUploadPending ? (
            <>
              <Loader2 size={16} className="animate-spin mr-2" />
              Uploading logo…
            </>
          ) : (
            "Create Developer"
          )}
        </button>
      </div>

      {/* Feedback messages */}
      {errorMsg && (
        <div className="text-sm text-destructive font-medium p-3 bg-destructive/10 rounded-lg flex items-start gap-2">
          <X size={14} className="flex-shrink-0 mt-0.5" />
          {errorMsg}
        </div>
      )}
      {success && (
        <div className="text-sm text-green-600 dark:text-green-400 font-medium p-3 bg-green-500/10 rounded-lg flex items-center gap-2">
          <CheckCircle2 size={14} className="flex-shrink-0" />
          Developer created successfully!
        </div>
      )}
    </form>
  );
}
