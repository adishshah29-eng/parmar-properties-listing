"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

import { z } from 'zod';
import { requireAuth } from "@/lib/auth/server-actions";

const createDeveloperSchema = z.object({
  name: z.string().min(1, "Name is required"),
  website: z.string().url().optional().or(z.literal("")),
  established: z.coerce.number().int().positive().optional().or(z.literal("")),
});

export async function createDeveloper(formData: FormData, logoUrl: string | null) {
  try {
    await requireAuth();
  } catch (err: any) {
    return { error: err.message };
  }

  const parsed = createDeveloperSchema.safeParse({
    name: formData.get("name"),
    website: formData.get("website"),
    established: formData.get("established"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const name = parsed.data.name.trim();
  const website = parsed.data.website?.trim() || null;
  const established = typeof parsed.data.established === 'number' ? parsed.data.established : null;

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
