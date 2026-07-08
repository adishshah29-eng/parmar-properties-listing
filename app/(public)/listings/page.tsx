export const revalidate = 3600;

import { createClient } from "@/lib/supabase/server";
import { getProjectStatus } from "@/lib/utils/project-status";
import GalleryClient from "@/app/(public)/_components/GalleryClient";

export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 20;

  const cityFilter = (params.city as string) || "All";
  const devFilter = (params.developer as string) || "All";
  const statusFilter = (params.status as string) || "All";

  const supabase = await createClient();
  
  // 1. Fetch unique cities & developers for the filters
  const [{ data: developers }, { data: projectsForCities }] = await Promise.all([
    supabase.from('developers').select('name').order('name'),
    supabase.from('projects').select('city')
  ]);
  const cities = ["All", ...Array.from(new Set((projectsForCities || []).map(p => p.city)))];
  const devNames = ["All", ...Array.from(new Set((developers || []).map(d => d.name)))];

  // 2. Fetch projects with server-side filters applied
  let query = supabase
    .from('projects')
    .select(`
      *,
      developer:developers!inner(*),
      images:project_images(url, sortOrder),
      configurations(*)
    `)
    .order('createdAt', { ascending: false });

  if (cityFilter !== 'All') {
    query = query.eq('city', cityFilter);
  }
  if (devFilter !== 'All') {
    query = query.eq('developer.name', devFilter);
  }

  const { data: rawProjects } = await query;

  // 3. Calculate derived status and apply status filter
  let processedProjects = (rawProjects || []).map(p => {
    // Only get the first image (cover image) to save payload size
    const sortedImages = [...(p.images || [])].sort((a, b) => a.sortOrder - b.sortOrder);
    const coverImage = sortedImages.length > 0 ? sortedImages[0] : null;

    const sortedConfigs = [...(p.configurations || [])].sort((a, b) => {
      if (a.bhk !== b.bhk) return a.bhk - b.bhk;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    return {
      ...p,
      images: coverImage ? [coverImage] : [], // Send only cover image
      configurations: sortedConfigs,
      derivedStatus: getProjectStatus(sortedConfigs)
    };
  });

  const bhkFilter = params.bhk ? (params.bhk as string).split(',').map(Number) : [];
  const minPrice = params.minPrice ? Number(params.minPrice) : null;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : null;

  if (statusFilter !== 'All') {
    processedProjects = processedProjects.filter(p => p.derivedStatus === statusFilter);
  }

  // Apply BHK and Price filters based on configurations
  if (bhkFilter.length > 0 || minPrice !== null || maxPrice !== null) {
    processedProjects = processedProjects.filter(p => {
      let matchingConfigs = p.configurations || [];

      if (bhkFilter.length > 0) {
        matchingConfigs = matchingConfigs.filter((cfg: any) => {
          return bhkFilter.some(b => {
            if (b === 5) return cfg.bhk >= 5; // "5" represents 5+
            return cfg.bhk === b;
          });
        });
      }

      if (minPrice !== null || maxPrice !== null) {
        matchingConfigs = matchingConfigs.filter((cfg: any) => {
          const price = cfg.carpetArea * cfg.pricePerSqft;
          if (minPrice !== null && price < minPrice) return false;
          if (maxPrice !== null && price > maxPrice) return false;
          return true;
        });
      }

      // Keep the project if at least one configuration matches all criteria
      return matchingConfigs.length > 0;
    });
  }

  // 4. Paginate
  const totalCount = processedProjects.length;
  const totalPages = Math.ceil(totalCount / limit);
  const paginatedProjects = processedProjects.slice((page - 1) * limit, page * limit);

  return <GalleryClient 
    projects={paginatedProjects} 
    cities={cities} 
    developers={devNames} 
    currentPage={page}
    totalPages={totalPages}
    totalCount={totalCount}
    initialFilters={{ city: cityFilter, developer: devFilter, status: statusFilter, bhk: bhkFilter, minPrice, maxPrice }}
  />;
}
