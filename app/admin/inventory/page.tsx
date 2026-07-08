import { createClient } from "@/lib/supabase/server";
import InventoryClient from "./_components/InventoryClient";
import { redirect } from "next/navigation";

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/admin/login');
  }
  const { data: rawProjects } = await supabase
    .from('projects')
    .select('*, configurations(*, inventory(*))')
    .order('createdAt', { ascending: false });

  const projects = (rawProjects || []).map(p => ({
    ...p,
    configurations: (p.configurations || []).map((c: any) => ({
      ...c,
      inventory: (c.inventory || []).sort((a: any, b: any) => {
        if (a.floor !== b.floor) return a.floor - b.floor;
        return a.unitNumber.localeCompare(b.unitNumber);
      })
    })).sort((a: any, b: any) => a.bhk - b.bhk)
  }));

  return <InventoryClient projects={projects} />;
}
