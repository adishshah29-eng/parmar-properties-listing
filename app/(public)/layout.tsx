import { SavedHomesProvider } from "./_providers/SavedHomesProvider";
import SavedHomesDrawer from "@/components/common/SavedHomesDrawer";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SavedHomesProvider>
      <Navbar />
      {children}
      <Footer />
      <SavedHomesDrawer />
    </SavedHomesProvider>
  );
}
