"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ConfigInput = {
  tempId: string;
  bhk: number;
  variantName: string;
  carpetArea: number;
  pricePerSqft: number;
  status: string;
  possessionDate: string;
  reraId: string;
};

export type FloorPlanInput = {
  configTempId: string;
  type: string;
  label: string;
  url: string;
};

export type InventoryInput = {
  configTempId: string;
  unitNumber: string;
  floor: number;
  facing: string;
  priceOverride: number | null;
  status: string;
  notes: string;
};

export type ProjectImageInput = {
  url: string;
  label: string;
};

export type ProjectInput = {
  developerId: string;
  name: string;
  slug: string;
  location: string;
  city: string;
  locality: string;
  description: string;
  amenities: string;
  latitude: number | null;
  longitude: number | null;
  images: ProjectImageInput[];
  configurations: ConfigInput[];
  floorPlans: FloorPlanInput[];
  inventory: InventoryInput[];
};

export async function createFullProject(data: ProjectInput) {
  const {
    developerId,
    name,
    slug,
    location,
    city,
    locality,
    description,
    amenities,
    latitude,
    longitude,
    images,
    configurations,
    floorPlans,
    inventory,
  } = data;

  if (!developerId || !name || !slug || !location || !city) {
    throw new Error("Missing required project fields.");
  }

  if (configurations.length === 0) {
    throw new Error("At least one configuration is required.");
  }

  const supabase = await createClient();

  // 1. Create Project
  const { data: project, error: projError } = await supabase.from('projects').insert({
    developerId,
    name,
    slug,
    location,
    city,
    locality: locality.trim() || null,
    description: description.trim() || null,
    amenities: amenities.trim() || null,
    latitude,
    longitude,
  }).select().single();

  if (projError || !project) {
    throw new Error(`Failed to create project: ${projError?.message}`);
  }

  try {
    // 2. Create Project Images
    const validImages = images.filter(img => img.url.trim()).map((img, i) => ({
      projectId: project.id,
      url: img.url.trim(),
      label: img.label.trim() || null,
      sortOrder: i,
    }));
    if (validImages.length > 0) {
      const { error: imgError } = await supabase.from('project_images').insert(validImages);
      if (imgError) throw imgError;
    }

    // Temp ID to DB ID mapping for configurations
    const configIdMap: Record<string, string> = {};

    // 3. Create Configurations
    for (const cfg of configurations) {
      const possessionDate = cfg.possessionDate ? new Date(cfg.possessionDate) : null;
      const normalizedPossessionDate =
        possessionDate && !Number.isNaN(possessionDate.getTime())
          ? possessionDate.toISOString()
          : null;

      const { data: createdConfig, error: cfgError } = await supabase.from('configurations').insert({
        projectId: project.id,
        bhk: Number(cfg.bhk),
        variantName: cfg.variantName.trim(),
        carpetArea: Number(cfg.carpetArea),
        pricePerSqft: Number(cfg.pricePerSqft),
        status: cfg.status,
        possessionDate: normalizedPossessionDate,
        reraId: cfg.reraId.trim() || null,
      }).select().single();

      if (cfgError || !createdConfig) throw cfgError || new Error("Failed to create configuration");

      configIdMap[cfg.tempId] = createdConfig.id;
    }

    // 4. Create Floor Plans
    const validFloorPlans = floorPlans.filter(fp => configIdMap[fp.configTempId]).map(fp => ({
      configurationId: configIdMap[fp.configTempId],
      type: fp.type,
      label: fp.label.trim(),
      url: fp.url.trim(),
      sortOrder: 0,
    }));
    if (validFloorPlans.length > 0) {
      const { error: fpError } = await supabase.from('floor_plans').insert(validFloorPlans);
      if (fpError) throw fpError;
    }

    // 5. Create Inventory Units
    const validInventory = inventory.filter(inv => configIdMap[inv.configTempId]).map(inv => ({
      configurationId: configIdMap[inv.configTempId],
      unitNumber: inv.unitNumber.trim(),
      floor: Number(inv.floor),
      facing: inv.facing.trim() || null,
      priceOverride: inv.priceOverride ? Number(inv.priceOverride) : null,
      status: inv.status,
      notes: inv.notes.trim() || null,
    }));
    if (validInventory.length > 0) {
      const { error: invError } = await supabase.from('inventory').insert(validInventory);
      if (invError) throw invError;
    }

  } catch (error: any) {
    // Cleanup on failure (relies on ON DELETE CASCADE)
    console.error("Transaction failed, rolling back project:", error);
    await supabase.from('projects').delete().eq('id', project.id);
    throw new Error(`Failed to save complete project details: ${error.message}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/");

  return { success: true, projectId: project.id };
}
