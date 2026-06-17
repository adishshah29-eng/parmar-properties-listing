"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createFullProject, ConfigInput, FloorPlanInput, InventoryInput, ProjectImageInput, ProjectDocumentInput } from "./actions";
import dynamic from "next/dynamic";

const AdminMap = dynamic(() => import("./AdminMap"), { ssr: false });

type Developer = {
  id: string;
  name: string;
};

type Props = {
  developers: Developer[];
};

export default function ProjectCreatorForm({ developers }: Props) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<"project" | "config" | "fp" | "inv">("project");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [projectDetails, setProjectDetails] = useState({
    developerId: developers[0]?.id || "",
    name: "",
    slug: "",
    location: "",
    city: "Mumbai",
    locality: "",
    description: "",
    amenities: "Swimming Pool, Gymnasium, Club House, Kids Play Area, 24/7 Security, Landscape Garden",
    latitude: 19.0760,
    longitude: 72.8777,
  });

  // Project Images / Links
  const [projectImages, setProjectImages] = useState<ProjectImageInput[]>([
    { url: "elevation.jpg", label: "Main Elevation" },
    { url: "amenities.jpg", label: "Clubhouse & Pool" },
  ]);

  // Project Documents
  const [projectDocuments, setProjectDocuments] = useState<ProjectDocumentInput[]>([
    { url: "brochure.pdf", name: "Project Brochure PDF" },
  ]);

  // Configurations
  const [configs, setConfigs] = useState<ConfigInput[]>([
    {
      tempId: "cfg-1",
      bhk: 3,
      variantName: "without Deck",
      carpetArea: 1000,
      pricePerSqft: 65000,
      status: "UNDER_CONSTRUCTION",
      possessionDate: "2032-12-31",
      reraId: "P518000123",
    },
  ]);

  // Floor Plans
  const [floorPlans, setFloorPlans] = useState<FloorPlanInput[]>([
    {
      configTempId: "cfg-1",
      type: "MASTER_LAYOUT",
      label: "Master Layout",
      url: "master_layout.jpg",
    },
    {
      configTempId: "cfg-1",
      type: "UNIT_LAYOUT",
      label: "3BHK Unit Layout",
      url: "unit_3bhk.jpg",
    },
  ]);

  // Inventory
  const [inventory, setInventory] = useState<InventoryInput[]>([
    {
      configTempId: "cfg-1",
      unitNumber: "1001",
      floor: 10,
      facing: "East",
      priceOverride: null,
      status: "AVAILABLE",
      notes: "East facing premium view",
    },
    {
      configTempId: "cfg-1",
      unitNumber: "1002",
      floor: 10,
      facing: "West",
      priceOverride: null,
      status: "BOOKED",
      notes: "West facing sunset view",
    },
  ]);

  // Handle Project Details Change
  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectDetails((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-generate slug from name
      if (name === "name" && !prev.slug) {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
      }
      return updated;
    });
  };

  // Image Actions
  const addProjectImage = () => {
    setProjectImages((prev) => [...prev, { url: "", label: "" }]);
  };

  const handleProjectImageChange = (index: number, field: keyof ProjectImageInput, value: string) => {
    setProjectImages((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeProjectImage = (index: number) => {
    setProjectImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Document Actions
  const addProjectDocument = () => {
    setProjectDocuments((prev) => [...prev, { url: "", name: "" }]);
  };

  const handleProjectDocumentChange = (index: number, field: keyof ProjectDocumentInput, value: string) => {
    setProjectDocuments((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeProjectDocument = (index: number) => {
    setProjectDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  // Config Actions
  const handleConfigChange = (index: number, field: keyof ConfigInput, value: any) => {
    setConfigs((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addConfig = () => {
    const newId = `cfg-${Date.now()}`;
    const newBhk = 3;
    const newVariant = "with Deck";

    // 1. Add Configuration
    setConfigs((prev) => [
      ...prev,
      {
        tempId: newId,
        bhk: newBhk,
        variantName: newVariant,
        carpetArea: 1200,
        pricePerSqft: 68000,
        status: "UNDER_CONSTRUCTION",
        possessionDate: "2032-12-31",
        reraId: "",
      },
    ]);

    // 2. Automatically generate a default Floor Plan for this configuration
    setFloorPlans((prev) => [
      ...prev,
      {
        configTempId: newId,
        type: "UNIT_LAYOUT",
        label: `${newBhk}BHK Layout (${newVariant})`,
        url: `unit_layout_${newBhk}bhk_${newVariant.toLowerCase().replace(/\s+/g, "_")}.jpg`,
      },
    ]);

    // 3. Automatically generate a default Inventory Unit for this configuration
    setInventory((prev) => [
      ...prev,
      {
        configTempId: newId,
        unitNumber: `${configs.length + 1}01`,
        floor: configs.length + 1,
        facing: "East",
        priceOverride: null,
        status: "AVAILABLE",
        notes: `Starter unit for ${newBhk} BHK ${newVariant}`,
      },
    ]);
  };

  const removeConfig = (index: number) => {
    if (configs.length === 1) {
      alert("At least one configuration is required.");
      return;
    }
    const tempIdToRemove = configs[index].tempId;
    setConfigs((prev) => prev.filter((_, i) => i !== index));
    // Also remove associated floor plans and inventory
    setFloorPlans((prev) => prev.filter((fp) => fp.configTempId !== tempIdToRemove));
    setInventory((prev) => prev.filter((inv) => inv.configTempId !== tempIdToRemove));
  };

  // Floor Plan Actions (scoped to specific config)
  const addFloorPlanForConfig = (configTempId: string) => {
    const cfg = configs.find((c) => c.tempId === configTempId);
    const bhkLabel = cfg ? `${cfg.bhk} BHK` : "Unit";
    setFloorPlans((prev) => [
      ...prev,
      {
        configTempId,
        type: "UNIT_LAYOUT",
        label: `${bhkLabel} Alternate Layout`,
        url: "floor_plan.jpg",
      },
    ]);
  };

  const handleFloorPlanChange = (indexInGlobal: number, field: keyof FloorPlanInput, value: string) => {
    setFloorPlans((prev) => {
      const updated = [...prev];
      updated[indexInGlobal] = { ...updated[indexInGlobal], [field]: value };
      return updated;
    });
  };

  const removeFloorPlan = (indexInGlobal: number) => {
    setFloorPlans((prev) => prev.filter((_, i) => i !== indexInGlobal));
  };

  // Inventory Actions (scoped to specific config)
  const addInventoryUnitForConfig = (configTempId: string) => {
    const unitsForThisConfig = inventory.filter((inv) => inv.configTempId === configTempId);
    const nextUnitNo = 100 + unitsForThisConfig.length + 1;
    setInventory((prev) => [
      ...prev,
      {
        configTempId,
        unitNumber: `${nextUnitNo}`,
        floor: 1,
        facing: "East",
        priceOverride: null,
        status: "AVAILABLE",
        notes: "",
      },
    ]);
  };

  const handleInventoryChange = (indexInGlobal: number, field: keyof InventoryInput, value: any) => {
    setInventory((prev) => {
      const updated = [...prev];
      updated[indexInGlobal] = { ...updated[indexInGlobal], [field]: value };
      return updated;
    });
  };

  const removeInventoryUnit = (indexInGlobal: number) => {
    setInventory((prev) => prev.filter((_, i) => i !== indexInGlobal));
  };

  // Format Currency
  function formatInr(value: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  }

  // Compute overall project price range
  const prices = configs.map((cfg) => cfg.carpetArea * cfg.pricePerSqft);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  // Submit Form
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createFullProject({
        ...projectDetails,
        images: projectImages,
        documents: projectDocuments,
        configurations: configs,
        floorPlans,
        inventory,
      });

      if (result.success) {
        router.push("/admin");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-[24px] bg-admin-surface p-6 md:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
      {/* STEPPER HEADER */}
      <div className="collection-chips">
        <button
          onClick={() => setCurrentStep("project")}
          className={`chip ${currentStep === "project" ? "active" : ""}`}
        >
          1 · Project Identity & Media
        </button>
        <button
          onClick={() => setCurrentStep("config")}
          className={`chip ${currentStep === "config" ? "active" : ""}`}
        >
          2 · Configurations ({configs.length})
        </button>
        <button
          onClick={() => setCurrentStep("fp")}
          className={`chip ${currentStep === "fp" ? "active" : ""}`}
        >
          3 · Connected Floor Plans ({floorPlans.length})
        </button>
        <button
          onClick={() => setCurrentStep("inv")}
          className={`chip ${currentStep === "inv" ? "active" : ""}`}
        >
          4 · Connected Inventory ({inventory.length})
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border-red-200 bg-admin-red/10 p-4 text-sm text-admin-red">
          {error}
        </div>
      )}

      {/* STEP 1: PROJECT DETAILS & MEDIA */}
      {currentStep === "project" && (
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-bold text-admin-text">Project Identity & Media</h3>
            <p className="text-xs text-admin-muted mt-1">
              Top-level project details, amenities, and external links/files.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-admin-muted">
                Developer
              </label>
              <select
                name="developerId"
                value={projectDetails.developerId}
                onChange={handleProjectChange}
                
              >
                {developers.map((dev) => (
                  <option key={dev.id} value={dev.id} className="bg-admin-card">
                    {dev.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-admin-muted">
                Project Name
              </label>
              <input
                type="text"
                name="name"
                value={projectDetails.name}
                onChange={handleProjectChange}
                placeholder="e.g. Runwal Raaya"
                required
                
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-admin-muted">
                Project Slug
              </label>
              <input
                type="text"
                name="slug"
                value={projectDetails.slug}
                onChange={handleProjectChange}
                placeholder="e.g. runwal-raaya"
                required
                
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-admin-muted">
                City
              </label>
              <input
                type="text"
                name="city"
                value={projectDetails.city}
                onChange={handleProjectChange}
                placeholder="e.g. Mumbai"
                required
                
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-admin-muted">
                Location (Full Address)
              </label>
              <input
                type="text"
                name="location"
                value={projectDetails.location}
                onChange={handleProjectChange}
                placeholder="e.g. Mulund West, Mumbai"
                required
                
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-admin-muted">
                Locality (Sub-area)
              </label>
              <input
                type="text"
                name="locality"
                value={projectDetails.locality}
                onChange={handleProjectChange}
                placeholder="e.g. Mulund"
                
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-admin-muted font-mono">
              Amenities (Comma-separated list)
            </label>
            <textarea
              name="amenities"
              value={projectDetails.amenities}
              onChange={handleProjectChange}
              rows={2}
              placeholder="e.g. Swimming Pool, Clubhouse, Gymnasium, Kids Play Area"
              
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-admin-muted font-mono">
              Description
            </label>
            <textarea
              name="description"
              value={projectDetails.description}
              onChange={handleProjectChange}
              rows={3}
              placeholder="Project overview for listing page..."
              
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-admin-muted font-mono">
              Map Location
            </label>
            <AdminMap 
              lat={projectDetails.latitude} 
              lng={projectDetails.longitude} 
              onChange={(lat, lng) => setProjectDetails(prev => ({ ...prev, latitude: lat, longitude: lng }))}
            />
          </div>

          {/* PROJECT IMAGES & LINKS SECTION */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h4 className="text-sm font-bold text-admin-text">Project Images, Files & Links</h4>
                <p className="text-xs text-admin-muted mt-0.5">
                  Add elevation photos, brochures, RERA certificates, or maps links.
                </p>
              </div>
              <button
                type="button"
                onClick={addProjectImage}
                className="rounded-lg border-yellow-200 bg-admin-gold-dim px-3 py-1.5 text-xs font-bold text-admin-gold hover:bg-admin-gold/20 transition-all"
              >
                + Add Image / Link
              </button>
            </div>

            <div className="space-y-3">
              {projectImages.map((img, index) => (
                <div key={index} className="flex gap-3 items-end bg-admin-card/40 border-gray-200 p-3 rounded-xl">
                  <div className="flex-1 grid gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-admin-muted">
                        Label / File Description
                      </label>
                      <input
                        type="text"
                        value={img.label}
                        onChange={(e) => handleProjectImageChange(index, "label", e.target.value)}
                        placeholder="e.g. Main Elevation, Brochure PDF"
                        
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-admin-muted">
                        Upload Image / File
                      </label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const fd = new FormData();
                          fd.append("file", file);
                          try {
                            const res = await fetch("/api/upload", { method: "POST", body: fd });
                            const data = await res.json();
                            if (data.url) handleProjectImageChange(index, "url", data.url);
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        
                      />
                      {img.url && <div className="text-[10px] text-admin-green truncate w-full" title={img.url}>Uploaded: {img.url}</div>}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeProjectImage(index)}
                    className="rounded bg-admin-surface border border-gray-100 px-2.5 py-2 text-xs font-bold text-admin-muted hover:border-admin-red hover:text-admin-red transition-all"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between gap-4 mt-8 mb-4">
              <div>
                <h4 className="text-sm font-bold text-admin-text">Project Documents</h4>
                <p className="text-xs text-admin-muted mt-0.5">
                  Add brochures, payment plans, or RERA certificates as downloadable files.
                </p>
              </div>
              <button
                type="button"
                onClick={addProjectDocument}
                className="rounded-lg border-blue-200 bg-admin-blue/10 px-3 py-1.5 text-xs font-bold text-[#2563eb] hover:bg-admin-blue/20 transition-all"
              >
                + Add Document
              </button>
            </div>

            <div className="space-y-3">
              {projectDocuments.map((doc, index) => (
                <div key={index} className="flex gap-3 items-end bg-admin-card/40 border-gray-200 p-3 rounded-xl">
                  <div className="flex-1 grid gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-admin-muted">
                        Document Name
                      </label>
                      <input
                        type="text"
                        value={doc.name}
                        onChange={(e) => handleProjectDocumentChange(index, "name", e.target.value)}
                        placeholder="e.g. Project Brochure"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-admin-muted">
                        Upload Document
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const fd = new FormData();
                          fd.append("file", file);
                          try {
                            const res = await fetch("/api/upload", { method: "POST", body: fd });
                            const data = await res.json();
                            if (data.url) handleProjectDocumentChange(index, "url", data.url);
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                      />
                      {doc.url && <div className="text-[10px] text-admin-green truncate w-full" title={doc.url}>Uploaded: {doc.url}</div>}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeProjectDocument(index)}
                    className="rounded bg-admin-surface border border-gray-100 px-2.5 py-2 text-xs font-bold text-admin-muted hover:border-admin-red hover:text-admin-red transition-all"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setCurrentStep("config")}
              className="btn-primary"
            >
              Next: Configurations →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CONFIGURATIONS */}
      {currentStep === "config" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-admin-text">Configurations</h3>
              <p className="text-xs text-admin-muted mt-1">
                Each BHK type / variant is a separate configuration. Adding a configuration automatically creates starter Floor Plans and Inventory!
              </p>
            </div>
            <button
              type="button"
              onClick={addConfig}
              className="rounded-lg border-purple-200 bg-admin-purple/10 px-3 py-1.5 text-xs font-bold text-admin-purple hover:bg-admin-purple/20 transition-all"
            >
              + Add Config
            </button>
          </div>

          <div className="space-y-4">
            {configs.map((cfg, index) => {
              const totalPrice = cfg.carpetArea * cfg.pricePerSqft;

              return (
                <div key={cfg.tempId} className="rounded-xl bg-admin-card shadow-sm border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-between gap-4 bg-admin-purple/5 border-b border-gray-200 px-4 py-3">
                    <span className="text-xs font-bold text-admin-purple flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-admin-purple/10 text-[10px]">
                        📐
                      </span>
                      Config #{index + 1} · {cfg.bhk} BHK {cfg.variantName || "New Variant"}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeConfig(index)}
                      className="rounded bg-admin-surface border border-gray-100 px-2 py-1 text-[10px] font-bold text-admin-muted hover:border-admin-red hover:text-admin-red transition-all"
                    >
                      ✕ Remove
                    </button>
                  </div>

                  <div className="p-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-admin-muted">
                        BHK
                      </label>
                      <select
                        value={cfg.bhk}
                        onChange={(e) => handleConfigChange(index, "bhk", Number(e.target.value))}
                        
                      >
                        <option value={1}>1 BHK</option>
                        <option value={2}>2 BHK</option>
                        <option value={3}>3 BHK</option>
                        <option value={4}>4 BHK</option>
                        <option value={5}>5 BHK</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-admin-muted">
                        Variant Name
                      </label>
                      <input
                        type="text"
                        value={cfg.variantName}
                        onChange={(e) => handleConfigChange(index, "variantName", e.target.value)}
                        placeholder="e.g. with Deck"
                        
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-admin-muted">
                        Carpet Area (sqft)
                      </label>
                      <input
                        type="number"
                        value={cfg.carpetArea}
                        onChange={(e) => handleConfigChange(index, "carpetArea", Number(e.target.value))}
                        placeholder="1000"
                        
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-admin-muted">
                        Rate (₹ psf)
                      </label>
                      <input
                        type="number"
                        value={cfg.pricePerSqft}
                        onChange={(e) => handleConfigChange(index, "pricePerSqft", Number(e.target.value))}
                        placeholder="65000"
                        
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-admin-muted">
                        Status
                      </label>
                      <select
                        value={cfg.status}
                        onChange={(e) => handleConfigChange(index, "status", e.target.value)}
                        
                      >
                        <option value="NEW_LAUNCH">New Launch</option>
                        <option value="UNDER_CONSTRUCTION">Under Construction</option>
                        <option value="READY_TO_MOVE">Ready to Move</option>
                        <option value="SOLD_OUT">Sold Out</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-admin-muted">
                        Possession Date
                      </label>
                      <input
                        type="date"
                        value={cfg.possessionDate}
                        onChange={(e) => handleConfigChange(index, "possessionDate", e.target.value)}
                        
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-admin-muted">
                        RERA ID
                      </label>
                      <input
                        type="text"
                        value={cfg.reraId}
                        onChange={(e) => handleConfigChange(index, "reraId", e.target.value)}
                        placeholder="P518..."
                        
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 justify-end">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-admin-muted font-mono block mb-1">
                        Total Price
                      </span>
                      <span className="text-sm font-bold text-admin-gold font-mono py-1.5">
                        {formatInr(totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Computed box */}
          <div className="rounded-xl border-yellow-200 bg-admin-gold-dim p-4">
            <span className="text-[9px] font-bold uppercase tracking-wider text-admin-muted font-mono block mb-1">
              Project Price Range (auto-computed from configs)
            </span>
            <span className="text-sm font-bold text-admin-gold font-mono">
              {formatInr(minPrice)} → {formatInr(maxPrice)}
            </span>
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setCurrentStep("project")}
              className="btn-secondary"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep("fp")}
              className="btn-primary"
            >
              Next: Floor Plans →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: FLOOR PLANS (Grouped & Connected) */}
      {currentStep === "fp" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-admin-text">Floor Plans</h3>
            <p className="text-xs text-admin-muted mt-1">
              Floor plans are visually grouped and linked directly to their parent configurations.
            </p>
          </div>

          <div className="space-y-8">
            {configs.map((cfg, configIndex) => {
              // Find floor plans linked to this config tempId
              const linkedPlans = floorPlans.map((fp, idx) => ({ fp, originalIndex: idx })).filter((item) => item.fp.configTempId === cfg.tempId);

              return (
                <div key={cfg.tempId} className="rounded-xl border-emerald-200 bg-admin-card p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded bg-admin-green/10 text-xs">
                        📐
                      </span>
                      <h4 className="text-sm font-bold text-admin-text">
                        Config #{configIndex + 1} · {cfg.bhk} BHK {cfg.variantName}
                      </h4>
                      <span className="rounded bg-admin-green/10 border-emerald-200 px-2 py-0.5 text-[8px] font-bold tracking-wider text-admin-green uppercase">
                        Connected
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => addFloorPlanForConfig(cfg.tempId)}
                      className="rounded border-emerald-200 bg-admin-green/10 px-2.5 py-1 text-[10px] font-bold text-admin-green hover:bg-admin-green/20 transition-all"
                    >
                      + Add Floor Plan to Config #{configIndex + 1}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {linkedPlans.length === 0 ? (
                      <p className="text-xs text-admin-muted italic py-2">No floor plans connected to this configuration.</p>
                    ) : (
                      linkedPlans.map(({ fp, originalIndex }) => (
                        <div key={originalIndex} className="bg-admin-surface/50 border-gray-100 p-4 rounded-xl grid gap-4 sm:grid-cols-3 items-end">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-admin-muted">
                              Layout Type
                            </label>
                            <select
                              value={fp.type}
                              onChange={(e) => handleFloorPlanChange(originalIndex, "type", e.target.value)}
                              
                            >
                              <option value="MASTER_LAYOUT">Master Layout</option>
                              <option value="FLOOR_PLATE">Floor Plate Layout</option>
                              <option value="UNIT_LAYOUT">Unit Layout</option>
                            </select>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-admin-muted">
                              Label
                            </label>
                            <input
                              type="text"
                              value={fp.label}
                              onChange={(e) => handleFloorPlanChange(originalIndex, "label", e.target.value)}
                              placeholder="e.g. Master Layout"
                              
                            />
                          </div>

                          <div className="flex gap-2 items-center">
                            <div className="flex flex-col gap-1.5 flex-1">
                              <label className="text-xs font-bold uppercase tracking-wider text-admin-muted">
                                Upload Floor Plan Image
                              </label>
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const fd = new FormData();
                                  fd.append("file", file);
                                  try {
                                    const res = await fetch("/api/upload", { method: "POST", body: fd });
                                    const data = await res.json();
                                    if (data.url) handleFloorPlanChange(originalIndex, "url", data.url);
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }}
                                
                              />
                              {fp.url && <div className="text-[10px] text-admin-green truncate w-full" title={fp.url}>Uploaded: {fp.url}</div>}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFloorPlan(originalIndex)}
                              className="rounded bg-admin-surface border border-gray-100 px-2.5 py-2 text-xs font-bold text-admin-muted hover:border-admin-red hover:text-admin-red transition-all"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setCurrentStep("config")}
              className="btn-secondary"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep("inv")}
              className="btn-primary"
            >
              Next: Inventory →
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: INVENTORY UNITS (Grouped & Connected) */}
      {currentStep === "inv" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-admin-text">Inventory Units</h3>
            <p className="text-xs text-admin-muted mt-1">
              Inventory tables are visually grouped and linked directly to their parent configurations.
            </p>
          </div>

          <div className="space-y-8">
            {configs.map((cfg, configIndex) => {
              // Find inventory units linked to this config tempId
              const linkedInventory = inventory.map((inv, idx) => ({ inv, originalIndex: idx })).filter((item) => item.inv.configTempId === cfg.tempId);

              return (
                <div key={cfg.tempId} className="rounded-xl border-orange-200 bg-admin-card p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded bg-admin-orange/10 text-xs">
                        🔑
                      </span>
                      <h4 className="text-sm font-bold text-admin-text">
                        Config #{configIndex + 1} · {cfg.bhk} BHK {cfg.variantName}
                      </h4>
                      <span className="rounded bg-admin-orange/10 border-orange-200 px-2 py-0.5 text-[8px] font-bold tracking-wider text-admin-orange uppercase">
                        Connected
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => addInventoryUnitForConfig(cfg.tempId)}
                      className="rounded border-orange-200 bg-admin-orange/10 px-2.5 py-1 text-[10px] font-bold text-admin-orange hover:bg-admin-orange/20 transition-all"
                    >
                      + Add Unit to Config #{configIndex + 1}
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs text-admin-text">
                      <thead>
                        <tr className="border-b border-gray-200 text-[9px] font-bold uppercase tracking-wider text-admin-muted font-mono">
                          <th className="pb-3 pr-4">Unit No.</th>
                          <th className="pb-3 px-4">Floor</th>
                          <th className="pb-3 px-4">Facing</th>
                          <th className="pb-3 px-4">Price Override</th>
                          <th className="pb-3 px-4">Status</th>
                          <th className="pb-3 px-4">Notes</th>
                          <th className="pb-3 pl-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {linkedInventory.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-4 text-center text-admin-muted italic">
                              No inventory units connected to this configuration.
                            </td>
                          </tr>
                        ) : (
                          linkedInventory.map(({ inv, originalIndex }) => (
                            <tr key={originalIndex} className="hover:bg-admin-card/20">
                              <td className="py-3 pr-4">
                                <input
                                  type="text"
                                  value={inv.unitNumber}
                                  onChange={(e) => handleInventoryChange(originalIndex, "unitNumber", e.target.value)}
                                  placeholder="e.g. 1001"
                                  
                                />
                              </td>
                              <td className="py-3 px-4">
                                <input
                                  type="number"
                                  value={inv.floor}
                                  onChange={(e) => handleInventoryChange(originalIndex, "floor", Number(e.target.value))}
                                  placeholder="10"
                                  
                                />
                              </td>
                              <td className="py-3 px-4">
                                <select
                                  value={inv.facing}
                                  onChange={(e) => handleInventoryChange(originalIndex, "facing", e.target.value)}
                                  
                                >
                                  <option value="East">East</option>
                                  <option value="West">West</option>
                                  <option value="North">North</option>
                                  <option value="South">South</option>
                                  <option value="NE">North East</option>
                                  <option value="NW">North West</option>
                                  <option value="SE">South East</option>
                                  <option value="SW">South West</option>
                                </select>
                              </td>
                              <td className="py-3 px-4">
                                <input
                                  type="number"
                                  value={inv.priceOverride || ""}
                                  onChange={(e) => handleInventoryChange(originalIndex, "priceOverride", e.target.value ? Number(e.target.value) : null)}
                                  placeholder="Use config price"
                                  
                                />
                              </td>
                              <td className="py-3 px-4">
                                <select
                                  value={inv.status}
                                  onChange={(e) => handleInventoryChange(originalIndex, "status", e.target.value)}
                                  
                                >
                                  <option value="AVAILABLE">Available</option>
                                  <option value="BOOKED">Booked</option>
                                  <option value="HOLD">Hold</option>
                                  <option value="SOLD">Sold</option>
                                </select>
                              </td>
                              <td className="py-3 px-4">
                                <input
                                  type="text"
                                  value={inv.notes}
                                  onChange={(e) => handleInventoryChange(originalIndex, "notes", e.target.value)}
                                  placeholder="Standard unit"
                                  
                                />
                              </td>
                              <td className="py-3 pl-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => removeInventoryUnit(originalIndex)}
                                  className="rounded bg-admin-surface border border-gray-100 px-2 py-1 text-xs font-bold text-admin-muted hover:border-admin-red hover:text-admin-red transition-all"
                                >
                                  ✕
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setCurrentStep("fp")}
              className="btn-secondary"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? "Saving Project..." : "✓ Save Project"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
