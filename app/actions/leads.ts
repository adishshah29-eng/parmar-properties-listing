"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitLead(formData: FormData) {
  try {
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const tourDate = formData.get("tour_date") as string;
    const tourTime = formData.get("tour_time") as string;
    const projectId = formData.get("projectId") as string;

    if (!name || !email || !phone || !tourDate || !tourTime || !projectId) {
      return { success: false, error: "All fields are required." };
    }

    const { error } = await supabase.from("leads").insert([
      {
        project_id: projectId,
        name: name,
        email: email,
        phone: phone,
        tour_date: tourDate,
        tour_time: tourTime,
      }
    ]);

    if (error) {
      console.error("Error submitting lead:", error);
      return { success: false, error: "Failed to submit your request. Please try again later." };
    }

    return { success: true };
  } catch (error) {
    console.error("Exception submitting lead:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
