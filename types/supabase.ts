export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      site_settings: {
        Row: {
          id: string
          whatsappNumber: string
          updatedAt: string
        }
        Insert: {
          id?: string
          whatsappNumber: string
          updatedAt?: string
        }
        Update: {
          id?: string
          whatsappNumber?: string
          updatedAt?: string
        }
      }
      developers: {
        Row: {
          id: string
          name: string
          logoUrl: string | null
          website: string | null
          established: number | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          name: string
          logoUrl?: string | null
          website?: string | null
          established?: number | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          name?: string
          logoUrl?: string | null
          website?: string | null
          established?: number | null
          createdAt?: string
          updatedAt?: string
        }
      }
      projects: {
        Row: {
          id: string
          developerId: string
          name: string
          slug: string
          location: string
          city: string
          locality: string | null
          description: string | null
          amenities: string | null
          latitude: number | null
          longitude: number | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          developerId: string
          name: string
          slug: string
          location: string
          city: string
          locality?: string | null
          description?: string | null
          amenities?: string | null
          latitude?: number | null
          longitude?: number | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          developerId?: string
          name?: string
          slug?: string
          location?: string
          city?: string
          locality?: string | null
          description?: string | null
          amenities?: string | null
          latitude?: number | null
          longitude?: number | null
          createdAt?: string
          updatedAt?: string
        }
      }
      project_images: {
        Row: {
          id: string
          projectId: string
          url: string
          label: string | null
          sortOrder: number
          createdAt: string
        }
        Insert: {
          id?: string
          projectId: string
          url: string
          label?: string | null
          sortOrder?: number
          createdAt?: string
        }
        Update: {
          id?: string
          projectId?: string
          url?: string
          label?: string | null
          sortOrder?: number
          createdAt?: string
        }
      }
      configurations: {
        Row: {
          id: string
          projectId: string
          bhk: number
          variantName: string
          carpetArea: number
          pricePerSqft: number
          status: string
          possessionDate: string | null
          reraId: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          projectId: string
          bhk: number
          variantName: string
          carpetArea: number
          pricePerSqft: number
          status: string
          possessionDate?: string | null
          reraId?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          projectId?: string
          bhk?: number
          variantName?: string
          carpetArea?: number
          pricePerSqft?: number
          status?: string
          possessionDate?: string | null
          reraId?: string | null
          createdAt?: string
          updatedAt?: string
        }
      }
      floor_plans: {
        Row: {
          id: string
          configurationId: string
          type: string
          label: string
          url: string
          sortOrder: number
          createdAt: string
        }
        Insert: {
          id?: string
          configurationId: string
          type: string
          label: string
          url: string
          sortOrder?: number
          createdAt?: string
        }
        Update: {
          id?: string
          configurationId?: string
          type?: string
          label?: string
          url?: string
          sortOrder?: number
          createdAt?: string
        }
      }
      inventory: {
        Row: {
          id: string
          configurationId: string
          unitNumber: string
          floor: number
          facing: string | null
          priceOverride: number | null
          status: string
          notes: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          configurationId: string
          unitNumber: string
          floor: number
          facing?: string | null
          priceOverride?: number | null
          status?: string
          notes?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          configurationId?: string
          unitNumber?: string
          floor?: number
          facing?: string | null
          priceOverride?: number | null
          status?: string
          notes?: string | null
          createdAt?: string
          updatedAt?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
