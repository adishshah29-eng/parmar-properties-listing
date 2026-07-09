import FadeIn from "@/components/common/FadeIn";
import { createClient } from "@/lib/supabase/server";
import SystemVisualizer from "./_components/InteractiveVisualizer";
import { Database } from "@/types/supabase";
import { redirect } from "next/navigation";
import { Users, Building2, Key, Database as DbIcon } from "lucide-react";

type Developer = Database['public']['Tables']['developers']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];
type Configuration = Database['public']['Tables']['configurations']['Row'];
type Inventory = Database['public']['Tables']['inventory']['Row'];
type FloorPlan = Database['public']['Tables']['floor_plans']['Row'];
type ProjectImage = Database['public']['Tables']['project_images']['Row'];

interface StatProps {
  developers: number;
  projects: number;
  configurations: number;
  inventory: number;
}

interface DeveloperNode extends Developer {
  projects: ProjectNode[];
}

interface ProjectNode extends Project {
  images: ProjectImage[];
  configurations: ConfigurationNode[];
}

interface ConfigurationNode extends Configuration {
  floorPlans: FloorPlan[];
  inventory: Inventory[];
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/admin/login');
  }

  const [
    { count: developerCount },
    { count: projectCount },
    { count: configurationCount },
    { count: inventoryCount },
    { data: rawDevelopers }
  ] = await Promise.all([
    supabase.from('developers').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('configurations').select('*', { count: 'exact', head: true }),
    supabase.from('inventory').select('*', { count: 'exact', head: true }),
    supabase.from('developers').select(`
      *,
      projects (
        *,
        configurations (
          *,
          floorPlans:floor_plans(*),
          inventory(*)
        ),
        images:project_images(*)
      )
    `).order('name', { ascending: true })
  ]);

  // Sort nested relations since it's tricky to do multi-level sorting in single query
  const developers = (rawDevelopers || []).map(dev => ({
    ...dev,
    projects: (dev.projects || []).map((proj: any) => ({
      ...proj,
      configurations: (proj.configurations || []).map((cfg: any) => ({
        ...cfg,
        floorPlans: (cfg.floorPlans || []).sort((a: any, b: any) => a.sortOrder - b.sortOrder),
        inventory: (cfg.inventory || []).sort((a: any, b: any) => {
          if (a.floor !== b.floor) return a.floor - b.floor;
          return a.unitNumber.localeCompare(b.unitNumber);
        })
      })).sort((a: any, b: any) => {
        if (a.bhk !== b.bhk) return a.bhk - b.bhk;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }),
      images: (proj.images || []).sort((a: any, b: any) => a.sortOrder - b.sortOrder)
    })).sort((a: any, b: any) => a.name.localeCompare(b.name))
  })) as unknown as DeveloperNode[];

  const stats: StatProps = {
    developers: developerCount || 0,
    projects: projectCount || 0,
    configurations: configurationCount || 0,
    inventory: inventoryCount || 0,
  };

  const statCards = [
    { label: "Developers", value: stats.developers, icon: Users },
    { label: "Projects", value: stats.projects, icon: Building2 },
    { label: "Configurations", value: stats.configurations, icon: DbIcon },
    { label: "Inventory Units", value: stats.inventory, icon: Key },
  ];

  return (
    <div className="pb-20">
      <FadeIn>
        <h1 className="text-4xl font-serif font-medium tracking-tight mb-2">Overview</h1>
        <p className="text-muted-foreground mb-12">High-level metrics and system hierarchy.</p>
      </FadeIn>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat, idx) => (
          <FadeIn key={stat.label} delay={0.1 * idx}>
            <div className="bg-card/60 backdrop-blur-md border border-border/60 p-6 rounded-3xl hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-sans font-semibold group-hover:text-primary transition-colors">{stat.label}</div>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <stat.icon size={14} className="text-primary" />
                </div>
              </div>
              <div className="text-5xl font-serif font-medium">{stat.value}</div>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.4}>
        <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-3xl overflow-hidden shadow-xl shadow-black/5">
          <div className="p-6 border-b border-border/50 bg-muted/30">
            <h2 className="font-serif text-xl font-medium">Interactive Architecture Map</h2>
            <p className="text-xs text-muted-foreground mt-1">Expand nodes to view underlying data structures</p>
          </div>
          <div className="p-6">
            <SystemVisualizer initialDevelopers={developers} stats={stats} />
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
