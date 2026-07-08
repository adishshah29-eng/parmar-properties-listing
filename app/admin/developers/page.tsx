import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import DeveloperForm from "./_components/DeveloperForm";

async function deleteDeveloper(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();

  // Due to ON DELETE CASCADE on the DB level, we only need to delete the developer
  await supabase.from('developers').delete().eq('id', id);

  revalidatePath("/admin");
  revalidatePath("/admin/developers");
  revalidatePath("/admin/projects");
  revalidatePath("/");
}

export default async function DevelopersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/admin/login');
  }
  const { data: rawDevelopers } = await supabase
    .from('developers')
    .select('*, projects(count)')
    .order('createdAt', { ascending: false });

  const developers = (rawDevelopers || []).map(d => ({
    ...d,
    _count: { projects: (d.projects?.[0] as any)?.count || 0 }
  }));

  return (
    <section style={{ padding: "48px 48px" }}>
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-[24px] bg-admin-surface p-6 md:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <h2 className="text-xl font-bold text-admin-text">Developers</h2>
          <p className="mt-1 text-sm text-admin-muted">
            Current builder records used by the listing data.
          </p>

          <div className="mt-6 overflow-hidden rounded-xl shadow-sm bg-admin-card">
            <div className="grid grid-cols-[1.4fr_0.7fr_0.7fr] gap-3 border-b border-border bg-admin-card px-4 py-3 text-xs font-bold uppercase tracking-wider text-admin-muted font-mono">
              <div>Name</div>
              <div>Projects</div>
              <div>Actions</div>
            </div>
            {developers.length === 0 ? (
              <div className="px-4 py-6 text-sm text-admin-muted">No developers yet.</div>
            ) : (
              developers.map((developer) => (
                <div
                  key={developer.id}
                  className="grid grid-cols-[1.4fr_0.7fr_0.7fr] gap-3 border-b border-border px-4 py-4 last:border-b-0 text-sm hover:bg-admin-surface transition-all"
                >
                  <div>
                    <p className="font-semibold text-admin-text">{developer.name}</p>
                    <p className="text-xs text-admin-muted">
                      {developer.website ?? "No website"}
                    </p>
                  </div>
                  <div className="text-sm text-admin-text self-center">
                    {developer._count.projects}
                  </div>
                  <div className="self-center">
                    <form action={deleteDeveloper}>
                      <input type="hidden" name="id" value={developer.id} />
                      <button
                        type="submit"
                        className="btn-secondary" style={{color: "var(--admin-red)"}}
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[24px] bg-admin-surface p-6 md:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <h2 className="text-xl font-bold text-admin-text">Add Developer</h2>
          <DeveloperForm />
        </div>
      </div>
    </section>
  );
}
