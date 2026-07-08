import { SavedHomesProvider } from "./_providers/SavedHomesProvider";
import SavedHomesDrawer from "@/components/common/SavedHomesDrawer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SavedHomesProvider>
      {children}
      <SavedHomesDrawer />
    </SavedHomesProvider>
  );
}
