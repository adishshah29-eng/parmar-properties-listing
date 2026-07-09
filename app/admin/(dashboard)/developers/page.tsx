import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import FadeIn from "@/components/common/FadeIn";
import DeveloperForm from "./_components/DeveloperForm";
import { Trash2 } from "lucide-react";

import { z } from 'zod';

const deleteDeveloperSchema = z.object({
  id: z.string().uuid(),
});

async function deleteDeveloper(formData: FormData) {
  "use server";
  const parsed = deleteDeveloperSchema.safeParse({
    id: formData.get("id"),
  });
  if (!parsed.success) return;
  const id = parsed.data.id;
  
  const supabase = await createClient();
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
    <div className="pb-20">
      <FadeIn>
        <h1 className="text-4xl font-serif font-medium tracking-tight mb-2">Developers</h1>
        <p className="text-muted-foreground mb-12">Current builder records used by the listing data.</p>
      </FadeIn>
      
      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <FadeIn delay={0.2}>
          <div className="bg-card/60 backdrop-blur-md border border-border/60 p-6 md:p-8 rounded-3xl shadow-xl shadow-black/5">
            <h2 className="text-xl font-serif font-medium mb-6">Directory</h2>

            <div className="flex flex-col gap-3">
              {developers.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground bg-muted/30 rounded-2xl border border-dashed border-border">
                  No developers yet.
                </div>
              ) : (
                developers.map((developer) => (
                  <div
                    key={developer.id}
                    className="group relative flex items-center justify-between p-5 bg-background/40 border border-border/50 rounded-2xl hover:bg-background/80 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                  >
                    <div>
                      <p className="font-medium text-foreground">{developer.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {developer.website ?? "No website"}
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Projects</div>
                        <div className="text-sm font-medium">{developer._count.projects}</div>
                      </div>
                      <form action={deleteDeveloper}>
                        <input type="hidden" name="id" value={developer.id} />
                        <button
                          type="submit"
                          className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
                          title="Delete Developer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </form>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="bg-card/60 backdrop-blur-md border border-border/60 p-6 md:p-8 rounded-3xl shadow-xl shadow-black/5 sticky top-8">
            <h2 className="text-xl font-serif font-medium mb-6">Add Developer</h2>
            <DeveloperForm />
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
