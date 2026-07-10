"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/auth/server-actions";

export async function updateSettings(whatsappNumber: string) {
  try {
    await requireAuth();
  } catch (err: any) {
    throw new Error('Unauthorized');
  }

  const supabase = await createClient();
  try {
    const { data: existing, error: fetchError } = await supabase.from('site_settings').select('id').limit(1).maybeSingle();
    if (fetchError) throw new Error(fetchError.message);
    
    if (existing) {
      const { error } = await supabase.from('site_settings').update({ whatsappNumber, updatedAt: new Date().toISOString() }).eq('id', existing.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from('site_settings').insert({ whatsappNumber });
      if (error) throw new Error(error.message);
    }
  } catch (err: any) {
    throw new Error(`Failed to update settings: ${err.message}`);
  }
  revalidatePath("/", "layout");
}
