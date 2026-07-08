"use client";

import React from "react";
import { useRouter } from "next/navigation";
import PropertyCard from "@/components/common/PropertyCard";
import FadeIn from "@/components/common/FadeIn";

export default function SimilarPropertiesClient({ projects }: { projects: any[] }) {
  const router = useRouter();

  if (!projects || projects.length === 0) return null;

  return (
    <FadeIn delay={0.6} className="mb-12">
      <h2 className="font-sans text-[22px] md:text-2xl mb-6 text-foreground font-semibold">Similar Properties You Might Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {projects.map((project) => (
          <PropertyCard 
            key={project.id} 
            project={project} 
            onClick={() => router.push(`/projects/${project.slug}`)} 
          />
        ))}
      </div>
    </FadeIn>
  );
}
