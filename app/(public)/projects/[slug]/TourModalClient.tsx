"use client";

import React, { useState } from "react";
import { submitLead } from "@/app/actions/leads";
import { X } from "lucide-react";

export default function TourModalClient({ projectId, projectName }: { projectId: string, projectName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    formData.append("projectId", projectId);

    const result = await submitLead(formData);

    if (result.success) {
      setStatus("success");
      setTimeout(() => {
        setIsOpen(false);
        setStatus("idle");
      }, 3000);
    } else {
      setStatus("error");
      setErrorMessage(result.error || "Failed to submit request.");
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-primary/10 hover:bg-primary/20 text-primary font-medium text-center py-3 rounded-md transition-colors w-full no-underline"
      >
        Request Tour
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
            
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-serif font-medium text-foreground mb-2">Request a Tour</h2>
              <p className="text-muted-foreground text-sm mb-6 font-sans">
                Schedule a personalized tour of <strong>{projectName}</strong> with our experts.
              </p>

              {status === "success" ? (
                <div className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 p-4 rounded-xl text-center">
                  <div className="font-medium text-lg mb-1">Request Received!</div>
                  <div className="text-sm">We will contact you shortly to confirm your tour.</div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Your Name</label>
                    <input required name="name" type="text" className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Email Address</label>
                    <input required name="email" type="email" className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Phone Number</label>
                    <input required name="phone" type="tel" className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors" placeholder="+91 98765 43210" />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Date</label>
                      <input required name="tour_date" type="date" className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors" />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Time</label>
                      <select required name="tour_time" className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors appearance-none">
                        <option value="">Select Time</option>
                        <option value="Morning (10AM - 12PM)">Morning (10AM - 12PM)</option>
                        <option value="Afternoon (12PM - 4PM)">Afternoon (12PM - 4PM)</option>
                        <option value="Evening (4PM - 7PM)">Evening (4PM - 7PM)</option>
                      </select>
                    </div>
                  </div>

                  {status === "error" && (
                    <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
                  )}

                  <button 
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-lg mt-4 hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {status === "loading" ? "Submitting..." : "Submit Request"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
