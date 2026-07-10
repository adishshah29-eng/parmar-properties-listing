"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function setActiveTemplate(templateId: number) {
  const cookieStore = await cookies();
  cookieStore.set("selected_featured_template", templateId.toString(), {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
  
  // Revalidate the home page so the new template is applied
  revalidatePath("/");
}

export async function setActiveNeighborhoodTemplate(templateId: number) {
  const cookieStore = await cookies();
  cookieStore.set("selected_neighborhood_template", templateId.toString(), {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
  
  // Revalidate the home page so the new template is applied
  revalidatePath("/");
}
