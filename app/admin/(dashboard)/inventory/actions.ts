"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/auth/server-actions";

export async function updateInventoryStatus(id: string, status: string) {
  try {
    await requireAuth();
  } catch (err: any) {
    return { error: 'Unauthorized' };
  }

  const supabase = await createClient();
  try {
    const { error } = await supabase.from('inventory').update({ status, updatedAt: new Date().toISOString() }).eq('id', id);
    if (error) throw new Error(error.message);
  } catch (err: any) {
    return { error: `Failed to update inventory: ${err.message}` };
  }
  revalidatePath("/admin/inventory");
  return { success: true };
}
