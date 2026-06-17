import { createClient } from "@/lib/supabase/server";
import ProjectCreatorForm from "./ProjectCreatorForm";

export default async function NewProjectPage() {
  const supabase = await createClient();
  const { data: rawDevelopers } = await supabase.from('developers').select('*').order('name', { ascending: true });
  const developers = rawDevelopers || [];

  return (
    <section style={{ padding: "48px 48px", maxWidth: "1200px" }}>
      <div>
        <h2 className="text-2xl font-bold text-admin-text">Create Project</h2>
        <p className="mt-1 text-sm text-admin-muted">
          Add a new project with multiple configurations, floor plans, and inventory units using our interactive form flow.
        </p>
      </div>

      {developers.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-admin-surface p-6">
          <p className="text-sm text-admin-muted">
            Add a developer first before creating a project.
          </p>
        </div>
      ) : (
        <ProjectCreatorForm developers={developers} />
      )}
    </section>
  );
}
