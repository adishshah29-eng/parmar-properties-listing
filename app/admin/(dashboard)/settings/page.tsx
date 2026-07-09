import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SettingsClient from "./_components/SettingsClient";
import FadeIn from "@/components/common/FadeIn";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div className="pb-20">
      <FadeIn>
        <h1 className="text-4xl font-serif font-medium tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground mb-12">Configure global platform variables.</p>
      </FadeIn>
      
      <FadeIn delay={0.2}>
        <SettingsClient />
      </FadeIn>
    </div>
  );
}
