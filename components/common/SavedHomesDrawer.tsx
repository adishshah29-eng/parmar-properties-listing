"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Share2, MapPin, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSavedHomes } from "@/app/(public)/_providers/SavedHomesProvider";

export default function SavedHomesDrawer() {
  const { savedHomes, removeSavedHome, isDrawerOpen, setDrawerOpen } = useSavedHomes();

  const handleShare = () => {
    if (savedHomes.length === 0) return;
    
    let message = "Take a look at these properties I shortlisted on Parmar Listing:\n\n";
    savedHomes.forEach((home, index) => {
      // In production, you would use window.location.origin
      const url = `http://localhost:3000/projects/${home.slug}`;
      message += `${index + 1}. ${home.name} - ${home.location}, ${home.city}\n${home.priceText}\nLink: ${url}\n\n`;
    });

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-[420px] bg-background h-full overflow-y-auto flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="p-5 flex items-center justify-between border-b border-border sticky top-0 bg-background/90 backdrop-blur-md z-10">
                <div className="flex items-center gap-2">
                  <Heart className="fill-red-500 text-red-500" size={20} />
                  <h2 className="font-serif text-xl font-medium">Saved Homes</h2>
                  <span className="bg-muted text-xs px-2 py-0.5 rounded-full">{savedHomes.length}</span>
                </div>
                <button onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* List */}
              <div className="p-5 flex-1 flex flex-col gap-4">
                {savedHomes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center flex-1 text-center text-muted-foreground">
                    <Heart className="mb-4 opacity-20" size={48} />
                    <p className="font-medium text-foreground">No saved homes yet</p>
                    <p className="text-sm mt-1">Tap the heart icon on any property to save it here for later.</p>
                    <button 
                      onClick={() => setDrawerOpen(false)}
                      className="mt-6 px-6 py-2 border border-border rounded-lg text-sm hover:border-primary transition-colors"
                    >
                      Continue Browsing
                    </button>
                  </div>
                ) : (
                  savedHomes.map((home) => (
                    <div key={home.id} className="flex gap-4 border border-border/50 rounded-xl p-3 bg-card hover:border-primary/30 transition-colors group">
                      <Link href={`/projects/${home.slug}`} onClick={() => setDrawerOpen(false)} className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <Image 
                          src={home.imageUrl} 
                          alt={home.name} 
                          fill 
                          className="object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      </Link>
                      
                      <div className="flex flex-col flex-1 min-w-0">
                        <Link href={`/projects/${home.slug}`} onClick={() => setDrawerOpen(false)}>
                          <h3 className="font-serif text-base font-medium truncate group-hover:text-primary transition-colors">{home.name}</h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <MapPin size={10} />
                            <span className="truncate">{home.location}, {home.city}</span>
                          </div>
                          <div className="text-sm font-medium mt-2">{home.priceText}</div>
                        </Link>
                      </div>

                      <button 
                        onClick={(e) => { e.preventDefault(); removeSavedHome(home.id); }}
                        className="p-2 h-fit text-muted-foreground hover:text-red-500 transition-colors bg-muted/50 rounded-md hover:bg-red-50"
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {savedHomes.length > 0 && (
                <div className="p-5 border-t border-border sticky bottom-0 bg-background flex flex-col gap-3">
                  {/* Compare Button Placeholder - To be implemented in Phase 2 */}
                  <button 
                    disabled={savedHomes.length < 2}
                    className="w-full bg-secondary text-secondary-foreground py-3 rounded-lg font-medium text-sm border border-border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={savedHomes.length < 2 ? "Save at least 2 properties to compare" : "Compare selected"}
                  >
                    Compare Properties (Coming Soon)
                  </button>
                  
                  <button 
                    onClick={handleShare}
                    className="w-full bg-[#25D366] text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 shadow-md hover:bg-[#128C7E] transition-colors"
                  >
                    <Share2 size={18} />
                    Share Shortlist via WhatsApp
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (only visible if drawer is closed and there are saved homes) */}
      <AnimatePresence>
        {!isDrawerOpen && savedHomes.length > 0 && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDrawerOpen(true)}
            className="fixed bottom-6 right-6 z-40 bg-foreground text-background w-14 h-14 rounded-full shadow-2xl flex items-center justify-center"
          >
            <div className="relative">
              <Heart className="fill-background" size={24} />
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-background">
                {savedHomes.length}
              </span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
