"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Minimal project data needed for the saved homes drawer
export type SavedProject = {
  id: string;
  slug: string;
  name: string;
  city: string;
  location: string;
  imageUrl: string;
  priceText: string;
};

type SavedHomesContextType = {
  savedHomes: SavedProject[];
  addSavedHome: (project: SavedProject) => void;
  removeSavedHome: (id: string) => void;
  isSaved: (id: string) => boolean;
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
};

const SavedHomesContext = createContext<SavedHomesContextType | undefined>(undefined);

export function SavedHomesProvider({ children }: { children: React.ReactNode }) {
  const [savedHomes, setSavedHomes] = useState<SavedProject[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load from local storage on mount
    try {
      const stored = localStorage.getItem("saved_homes");
      if (stored) setSavedHomes(JSON.parse(stored));
    } catch (e) {}
    setMounted(true);
  }, []);

  useEffect(() => {
    // Save to local storage when changed (if mounted)
    if (mounted) {
      localStorage.setItem("saved_homes", JSON.stringify(savedHomes));
    }
  }, [savedHomes, mounted]);

  const addSavedHome = (project: SavedProject) => {
    setSavedHomes((prev) => {
      if (prev.find((p) => p.id === project.id)) return prev;
      return [...prev, project];
    });
  };

  const removeSavedHome = (id: string) => {
    setSavedHomes((prev) => prev.filter((p) => p.id !== id));
  };

  const isSaved = (id: string) => {
    return savedHomes.some((p) => p.id === id);
  };

  return (
    <SavedHomesContext.Provider 
      value={{ savedHomes, addSavedHome, removeSavedHome, isSaved, isDrawerOpen, setDrawerOpen }}
    >
      {children}
    </SavedHomesContext.Provider>
  );
}

export function useSavedHomes() {
  const context = useContext(SavedHomesContext);
  if (context === undefined) {
    throw new Error("useSavedHomes must be used within a SavedHomesProvider");
  }
  return context;
}
