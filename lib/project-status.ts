import { Database } from "@/types/supabase";

type Configuration = Database["public"]["Tables"]["configurations"]["Row"];

export function getProjectStatus(configurations: Configuration[]) {
  if (!configurations || configurations.length === 0) return "UPCOMING";

  if (configurations.some((c) => c.status === "READY_TO_MOVE")) {
    return "READY_TO_MOVE";
  }
  if (configurations.some((c) => c.status === "UNDER_CONSTRUCTION")) {
    return "UNDER_CONSTRUCTION";
  }
  if (configurations.some((c) => c.status === "NEW_LAUNCH")) {
    return "NEW_LAUNCH";
  }
  return "SOLD_OUT";
}
