"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSettings(whatsappNumber: string) {
  const supabase = await createClient();
  const { data: existing } = await supabase.from('site_settings').select('id').limit(1).maybeSingle();
  if (existing) {
    await supabase.from('site_settings').update({ whatsappNumber, updatedAt: new Date().toISOString() }).eq('id', existing.id);
  } else {
    await supabase.from('site_settings').insert({ whatsappNumber });
  }
  revalidatePath("/", "layout");
}
