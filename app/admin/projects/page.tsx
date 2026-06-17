import Link from "next/link";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

async function deleteProject(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from('projects').delete().eq('id', id);

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/");
}

export default async function ProjectsPage() {
  const supabase = await createClient();
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
    <section style={{ padding: "48px 48px" }}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-admin-text">Projects</h2>
          <p className="mt-1 text-sm text-admin-muted">
            Manage project records and remove stale entries.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="btn-primary"
        >
          New Project
        </Link>
      </div>

      <div className="grid gap-6">
        {projects.length === 0 ? (
          <div className="rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] bg-admin-surface p-6 text-sm text-admin-muted">
            No projects yet.
          </div>
        ) : (
          projects.map((project) => {
            const prices = project.configurations.map(
              (cfg) => cfg.carpetArea * cfg.pricePerSqft
            );
            const minPrice = prices.length ? Math.min(...prices) : 0;
            const maxPrice = prices.length ? Math.max(...prices) : 0;

            return (
              <article
                key={project.id}
                className="rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] bg-admin-surface p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-admin-gold">
                      {project.developer.name}
                    </p>
                    <h3 className="text-2xl font-bold text-admin-text mt-1">{project.name}</h3>
                    <p className="mt-1 text-sm text-admin-muted">
                      {project.location}
                      {project.locality ? ` · ${project.locality}` : ""}
                    </p>
                  </div>

                  <form action={deleteProject}>
                    <input type="hidden" name="id" value={project.id} />
                    <button
                      type="submit"
                      className="btn-secondary" style={{color: "var(--admin-red)"}}
                    >
                      Delete Project
                    </button>
                  </form>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <MetricCard
                    label="Configurations"
                    value={project._count.configurations}
                  />
                  <MetricCard label="Images" value={project._count.images} />
                  <MetricCard
                    label="Price band"
                    value={
                      prices.length
                        ? `${formatInr(minPrice)} - ${formatInr(maxPrice)}`
                        : "Not set"
                    }
                  />
                </div>

                <div className="mt-6 grid gap-3">
                  {project.configurations.map((cfg) => (
                    <div
                      key={cfg.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl shadow-sm bg-admin-card px-4 py-3"
                    >
                      <div>
                        <p className="font-semibold text-admin-text text-sm">
                          {cfg.bhk} BHK {cfg.variantName}
                        </p>
                        <p className="text-xs text-admin-muted mt-0.5">
                          {cfg.carpetArea} sq ft · {cfg.status}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-admin-gold font-mono">
                        {formatInr(cfg.carpetArea * cfg.pricePerSqft)}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl shadow-sm bg-admin-card p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-admin-muted font-mono">{label}</p>
      <p className="mt-2 text-sm font-semibold text-admin-text">{value}</p>
    </div>
  );
}
