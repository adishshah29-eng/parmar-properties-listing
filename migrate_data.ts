import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function newUuid() {
  return crypto.randomUUID();
}

async function main() {
  console.log('Starting migration with UUID mapping...');

  const idMap = new Map<string, string>(); // cuid -> uuid

  try {
    // 1. Site Settings
    const settings = await prisma.siteSettings.findFirst();
    if (settings) {
      idMap.set(settings.id, newUuid());
      const { error } = await supabase.from('site_settings').insert({
        id: idMap.get(settings.id),
        whatsappNumber: settings.whatsappNumber,
        updatedAt: settings.updatedAt.toISOString(),
      });
      if (error) console.error('Error inserting settings:', error);
      else console.log('Migrated settings');
    }

    // 2. Developers
    const developers = await prisma.developer.findMany();
    if (developers.length) {
      for (const d of developers) {
        idMap.set(d.id, newUuid());
        const { error } = await supabase.from('developers').insert({
          id: idMap.get(d.id),
          name: d.name,
          logoUrl: d.logoUrl,
          website: d.website,
          established: d.established,
          createdAt: d.createdAt.toISOString(),
          updatedAt: d.updatedAt.toISOString(),
        });
        if (error) console.error('Error inserting developer:', d.name, error);
      }
      console.log(`Migrated developers`);
    }

    // 3. Projects
    const projects = await prisma.project.findMany();
    if (projects.length) {
      for (const p of projects) {
        idMap.set(p.id, newUuid());
        const { error } = await supabase.from('projects').insert({
          id: idMap.get(p.id),
          developerId: idMap.get(p.developerId)!,
          name: p.name,
          slug: p.slug,
          location: p.location,
          city: p.city,
          locality: p.locality,
          description: p.description,
          amenities: p.amenities,
          latitude: p.latitude,
          longitude: p.longitude,
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        });
        if (error) console.error('Error inserting project:', p.name, error);
      }
      console.log(`Migrated projects`);
    }

    // 4. Project Images
    const images = await prisma.projectImage.findMany();
    if (images.length) {
      for (const img of images) {
        idMap.set(img.id, newUuid());
        const { error } = await supabase.from('project_images').insert({
          id: idMap.get(img.id),
          projectId: idMap.get(img.projectId)!,
          url: img.url,
          label: img.label,
          sortOrder: img.sortOrder,
          createdAt: img.createdAt.toISOString(),
        });
        if (error) console.error('Error inserting image:', error);
      }
      console.log(`Migrated images`);
    }

    // 5. Configurations
    const configs = await prisma.configuration.findMany();
    if (configs.length) {
      for (const c of configs) {
        idMap.set(c.id, newUuid());
        const { error } = await supabase.from('configurations').insert({
          id: idMap.get(c.id),
          projectId: idMap.get(c.projectId)!,
          bhk: c.bhk,
          variantName: c.variantName,
          carpetArea: c.carpetArea,
          pricePerSqft: c.pricePerSqft,
          status: c.status,
          possessionDate: c.possessionDate ? c.possessionDate.toISOString() : null,
          reraId: c.reraId,
          createdAt: c.createdAt.toISOString(),
          updatedAt: c.updatedAt.toISOString(),
        });
        if (error) console.error('Error inserting configuration:', error);
      }
      console.log(`Migrated configurations`);
    }

    // 6. Floor Plans
    const floorPlans = await prisma.floorPlan.findMany();
    if (floorPlans.length) {
      for (const fp of floorPlans) {
        idMap.set(fp.id, newUuid());
        const { error } = await supabase.from('floor_plans').insert({
          id: idMap.get(fp.id),
          configurationId: idMap.get(fp.configurationId)!,
          type: fp.type,
          label: fp.label,
          url: fp.url,
          sortOrder: fp.sortOrder,
          createdAt: fp.createdAt.toISOString(),
        });
        if (error) console.error('Error inserting floor plan:', error);
      }
      console.log(`Migrated floor plans`);
    }

    // 7. Inventory
    const inventory = await prisma.inventory.findMany();
    if (inventory.length) {
      for (const inv of inventory) {
        idMap.set(inv.id, newUuid());
        const { error } = await supabase.from('inventory').insert({
          id: idMap.get(inv.id),
          configurationId: idMap.get(inv.configurationId)!,
          unitNumber: inv.unitNumber,
          floor: inv.floor,
          facing: inv.facing,
          priceOverride: inv.priceOverride,
          status: inv.status,
          notes: inv.notes,
          createdAt: inv.createdAt.toISOString(),
          updatedAt: inv.updatedAt.toISOString(),
        });
        if (error) console.error('Error inserting inventory:', error);
      }
      console.log(`Migrated inventory items`);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
