/**
 * nuke-db.js
 * Empties all application tables and clears the 'uploads' storage bucket
 * using the Supabase JS client (HTTPS API — no direct DB connection needed).
 *
 * Run with: node scripts/nuke-db.js
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

// --- Parse .env.local manually (no dotenv dependency needed) ---
const envFile = fs.readFileSync(".env.local", "utf8");
const env = {};
envFile.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^"|"$/g, "");
  }
});

const SUPABASE_URL = env["NEXT_PUBLIC_SUPABASE_URL"];
const SERVICE_ROLE_KEY = env["SUPABASE_SERVICE_ROLE_KEY"];

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// --- 1. Clear all tables in dependency order ---
async function nukeTables() {
  console.log("\n🗃️  Clearing all tables...");

  // Delete in child-first order so FK constraints are not violated.
  const tables = [
    "inventory",
    "floor_plans",
    "project_documents",
    "project_images",
    "configurations",
    "projects",
    "developers",
    "site_settings",
  ];

  for (const table of tables) {
    // Delete all rows — RLS is bypassed by the service role key.
    // neq filter on a non-null column is the standard Supabase trick to delete all rows.
    const { error } = await supabase
      .from(table)
      .delete()
      .not("id", "is", null);

    if (error) {
      console.error(`  ❌ Failed to clear '${table}':`, error.message);
    } else {
      console.log(`  ✅ Cleared: ${table}`);
    }
  }
}

// --- 2. Clear Supabase Storage bucket (including all sub-folders) ---
async function nukeStorageFolder(folderPath = "") {
  const { data, error } = await supabase.storage
    .from("uploads")
    .list(folderPath, { limit: 1000 });

  if (error) {
    console.error(`  ❌ Failed to list '${folderPath || "/"}':`, error.message);
    return;
  }
  if (!data || data.length === 0) return;

  const filePaths = [];
  const subFolders = [];

  for (const item of data) {
    const fullPath = folderPath ? `${folderPath}/${item.name}` : item.name;
    if (item.metadata === null) {
      // It's a folder (no metadata means it's a virtual prefix)
      subFolders.push(fullPath);
    } else {
      filePaths.push(fullPath);
    }
  }

  // Delete files at this level
  if (filePaths.length > 0) {
    const { error: delErr } = await supabase.storage.from("uploads").remove(filePaths);
    if (delErr) {
      console.error(`  ❌ Failed to delete files in '${folderPath || "/"}':`, delErr.message);
    } else {
      console.log(`  ✅ Deleted ${filePaths.length} file(s) from '${folderPath || "/"}'`);
    }
  }

  // Recurse into sub-folders
  for (const folder of subFolders) {
    await nukeStorageFolder(folder);
  }
}

async function nukeStorage() {
  console.log("\n🗑️  Clearing storage bucket: uploads");
  await nukeStorageFolder("");
  console.log("  ✅ Storage bucket cleared.");
}

// --- Main ---
async function main() {
  console.log("⚠️  NUCLEAR OPTION — Permanently deleting ALL data & files.\n");

  await nukeTables();
  await nukeStorage();

  console.log("\n🎉 Done! Your database and storage are now empty.\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
