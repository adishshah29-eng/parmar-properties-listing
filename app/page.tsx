import { createClient } from "@/lib/supabase/server";
import { getProjectStatus } from "@/lib/project-status";
import GalleryClient from "./GalleryClient";

export default async function Home() {
  const supabase = await createClient();
  
  const { data: rawProjects } = await supabase
    .from('projects')
    .select(`
      *,
      developer:developers(*),
      images:project_images(*),
      configurations(*)
    `)
    .order('createdAt', { ascending: false });

  // Handle nested sorting manually since Supabase JS multiple referenced ordering can be tricky
  const projects = (rawProjects || []).map(p => {
    const sortedImages = [...(p.images || [])].sort((a, b) => a.sortOrder - b.sortOrder);
    const sortedConfigs = [...(p.configurations || [])].sort((a, b) => {
      if (a.bhk !== b.bhk) return a.bhk - b.bhk;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    return {
      ...p,
      images: sortedImages,
      configurations: sortedConfigs,
      derivedStatus: getProjectStatus(sortedConfigs)
    };
  });

  return <GalleryClient projects={projects} />;
}
