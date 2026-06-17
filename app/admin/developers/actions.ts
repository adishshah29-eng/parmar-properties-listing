"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createDeveloper(formData: FormData, logoUrl: string | null) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required" };

  const website = String(formData.get("website") ?? "").trim() || null;
  const establishedRaw = String(formData.get("established") ?? "").trim();
  const established = establishedRaw ? Number(establishedRaw) : null;

  const supabase = await createClient();
  
  try {
    const { error } = await supabase.from('developers').insert({
      name,
      website,
      logoUrl,
      established: Number.isFinite(established) ? established : null,
    });

    if (error) {
      if (error.code === '23505') {
        return { error: `A developer with the name "${name}" already exists.` };
      }
      return { error: `Failed to create developer: ${error.message}` };
    }
  } catch (error: any) {
    return { error: `Unexpected error: ${error.message}` };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/developers");
  
  return { success: true };
}
