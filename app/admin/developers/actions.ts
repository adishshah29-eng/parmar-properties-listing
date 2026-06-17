"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createDeveloper(formData: FormData, logoUrl: string | null) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const website = String(formData.get("website") ?? "").trim() || null;
  const establishedRaw = String(formData.get("established") ?? "").trim();
  const established = establishedRaw ? Number(establishedRaw) : null;

  const supabase = await createClient();
  
  await supabase.from('developers').insert({
    name,
    website,
    logoUrl,
    established: Number.isFinite(established) ? established : null,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/developers");
}
