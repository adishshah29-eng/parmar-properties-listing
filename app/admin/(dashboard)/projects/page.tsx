import Link from "next/link";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import FadeIn from "@/components/common/FadeIn";
import { Trash2, Plus, Home, MapPin, Building2, ImageIcon } from "lucide-react";

function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

import { z } from 'zod';

const deleteProjectSchema = z.object({
  id: z.string().uuid(),
});

async function deleteProject(formData: FormData) {
  "use server";
  const parsed = deleteProjectSchema.safeParse({
    id: formData.get("id"),
  });
  if (!parsed.success) return;
  const id = parsed.data.id;

  const supabase = await createClient();
  await supabase.from('projects').delete().eq('id', id);
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/");
}

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/admin/login');
  }
  const { data: rawProjects } = await supabase
    .from('projects')
    .select(`
      *,
      developer:developers(*),
      configurations(*),
      images:project_images(count)
    `)
    .order('createdAt', { ascending: false });

  const projects = (rawProjects || []).map(p => ({
    ...p,
    configurations: (p.configurations || []).sort((a: any, b: any) => {
      if (a.bhk !== b.bhk) return a.bhk - b.bhk;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }),
    _count: {
      images: (p.images?.[0] as any)?.count || 0,
      configurations: (p.configurations || []).length
    }
  }));

  return (
    <div className="pb-20">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
        <FadeIn>
          <h1 className="text-4xl font-serif font-medium tracking-tight mb-2">Projects</h1>
          <p className="text-muted-foreground">Manage project records and remove stale entries.</p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-xl font-medium hover:bg-foreground/90 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-foreground/20 transition-all duration-300"
          >
            <Plus size={18} />
            <span>New Project</span>
          </Link>
        </FadeIn>
      </div>

      <div className="grid gap-6">
        {projects.length === 0 ? (
          <FadeIn delay={0.3}>
            <div className="p-8 text-center text-sm text-muted-foreground bg-muted/30 rounded-3xl border border-dashed border-border">
              No projects yet.
            </div>
          </FadeIn>
        ) : (
          projects.map((project, idx) => {
            const prices = project.configurations.map(
              (cfg: any) => cfg.carpetArea * cfg.pricePerSqft
            );
            const minPrice = prices.length ? Math.min(...prices) : 0;
            const maxPrice = prices.length ? Math.max(...prices) : 0;

            return (
              <FadeIn key={project.id} delay={0.1 * idx}>
                <article className="group bg-card/60 backdrop-blur-md border border-border/60 p-6 md:p-8 rounded-3xl shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-500">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">
                        {project.developer.name}
                      </p>
                      <h3 className="text-2xl font-serif font-medium text-foreground">{project.name}</h3>
                      <p className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <MapPin size={14} className="text-muted-foreground/70" />
                        <span>{project.location}{project.locality ? ` · ${project.locality}` : ""}</span>
                      </p>
                    </div>

                    <form action={deleteProject}>
                      <input type="hidden" name="id" value={project.id} />
                      <button
                        type="submit"
                        className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 shadow-sm"
                        title="Delete Project"
                      >
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3 mb-8">
                    <MetricCard label="Configurations" value={project._count.configurations} icon={Building2} />
                    <MetricCard label="Images" value={project._count.images} icon={ImageIcon} />
                    <MetricCard
                      label="Price band"
                      value={prices.length ? `${formatInr(minPrice)} - ${formatInr(maxPrice)}` : "Not set"}
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {project.configurations.map((cfg: any) => (
                      <div
                        key={cfg.id}
                        className="flex flex-col gap-2 rounded-2xl bg-background/40 border border-border/50 p-4 hover:bg-background/80 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-foreground text-sm">
                            {cfg.bhk} BHK {cfg.variantName}
                          </p>
                          <p className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded-md">
                            {formatInr(cfg.carpetArea * cfg.pricePerSqft)}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <Home size={12} />
                          {cfg.carpetArea} sq ft · {cfg.status}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              </FadeIn>
            );
          })
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon }: { label: string; value: number | string; icon?: any }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-background/30 border border-border/40 p-4">
      {Icon && (
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Icon size={18} className="text-primary" />
        </div>
      )}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-1">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}
