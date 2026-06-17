import { createClient } from "@/lib/supabase/server";
import SystemVisualizer from "./InteractiveVisualizer";
import { Database } from "@/types/supabase";
import { redirect } from "next/navigation";

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

  return (
    <div style={{ padding: "48px 48px" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "8px", fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Overview</h1>
      <p style={{ color: "var(--admin-text-muted)", marginBottom: "48px" }}>High-level metrics and system hierarchy.</p>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="s-label">Developers</div>
          <div className="s-value">{stats.developers}</div>
        </div>
        <div className="stat-card">
          <div className="s-label">Projects</div>
          <div className="s-value">{stats.projects}</div>
        </div>
        <div className="stat-card">
          <div className="s-label">Configurations</div>
          <div className="s-value">{stats.configurations}</div>
        </div>
        <div className="stat-card">
          <div className="s-label">Inventory Units</div>
          <div className="s-value">{stats.inventory}</div>
        </div>
      </div>

      <SystemVisualizer initialDevelopers={developers} stats={stats} />
    </div>
  );
}
