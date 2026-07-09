import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const { data: projects } = await supabase.from('projects').select('id, updatedAt').order('updatedAt', { ascending: false });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://parmarproperties.com';

  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  if (projects) {
    projects.forEach((project) => {
      sitemapEntries.push({
        url: `${baseUrl}/projects/${project.id}`,
        lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  }

  return sitemapEntries;
}
