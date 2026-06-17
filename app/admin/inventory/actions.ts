"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateInventoryStatus(id: string, status: string) {
  const supabase = await createClient();
  await supabase.from('inventory').update({ status, updatedAt: new Date().toISOString() }).eq('id', id);
  revalidatePath("/admin/inventory");
}
