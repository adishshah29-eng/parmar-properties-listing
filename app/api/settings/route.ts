import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from('site_settings').select('*').limit(1).single();
  return NextResponse.json(settings || { whatsappNumber: "" });
}
