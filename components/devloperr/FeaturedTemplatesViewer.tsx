"use client";

import React, { useState } from "react";
import { setActiveTemplate as setActiveTemplateAction } from "@/app/actions/template-settings";
import { Template1, Template2, Template3, Template4, Template5, Template6 } from "@/components/common/FeaturedTemplates";
import { motion } from "framer-motion";

export function FeaturedTemplatesViewer({ properties }: { properties: any[] }) {
  const [activeTemplate, setActiveTemplate] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);

  if (!properties || properties.length === 0) {
    return <div className="text-center py-20 text-muted-foreground">No properties available to showcase.</div>;
  }

  const templates = [
    { id: 1, name: "The Classic Grid" },
    { id: 2, name: "The Horizontal Scroll" },
    { id: 3, name: "The Minimalist Trio" },
    { id: 4, name: "The Alternating Showcase" },
    { id: 5, name: "The Masonry Gallery" },
    { id: 6, name: "The Hero Stack" },
  ];

  const handleSetHomeLayout = async () => {
    setIsSaving(true);
    await setActiveTemplateAction(activeTemplate);
    alert(`Template ${activeTemplate} is now set as your home page layout!`);
    setIsSaving(false);
  };

  return (
    <div>
      <div className="relative flex justify-center mb-16 px-4">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-background/60 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-primary/20 rounded-[2rem] p-3 flex flex-col md:flex-row items-center gap-4 max-w-4xl"
        >
          <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto px-2">
            {templates.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTemplate(t.id)}
                className={`relative px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
                  activeTemplate === t.id 
                    ? "text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {activeTemplate === t.id && (
                  <motion.div 
                    layoutId="activeTemplateBubble"
                    className="absolute inset-0 bg-primary rounded-full -z-10 shadow-lg shadow-primary/30"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                {t.id}. {t.name}
              </button>
            ))}
          </div>
          <div className="w-[1px] h-6 bg-white/10 hidden md:block mx-2"></div>
          <button
            onClick={handleSetHomeLayout}
            disabled={isSaving}
            className="shrink-0 px-6 py-2 bg-foreground text-background font-medium rounded-full hover:bg-foreground/90 transition-all hover:scale-[1.03] active:scale-[0.98] text-sm disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Set as Default"}
          </button>
        </motion.div>
      </div>

      <div className="mb-32">
        {activeTemplate === 1 && <Template1 properties={properties} />}
        {activeTemplate === 2 && <Template2 properties={properties} />}
        {activeTemplate === 3 && <Template3 properties={properties} />}
        {activeTemplate === 4 && <Template4 properties={properties} />}
        {activeTemplate === 5 && <Template5 properties={properties} />}
        {activeTemplate === 6 && <Template6 properties={properties} />}
      </div>
    </div>
  );
}
