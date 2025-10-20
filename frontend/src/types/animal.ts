export type AnimalType = 'Mammal' | 'Bird' | 'Reptile' | 'Amphibian' | 'Fish' | 'Invertebrate';

export type ConservationStatus = 
  | 'Extinct' 
  | 'Endangered' 
  | 'Vulnerable' 
  | 'Near Threatened' 
  | 'Least Concern';

export type AnimalSex = 'Male' | 'Female' | 'Unknown';

export interface Habitat {
  name: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  environment: string;
}

export interface Animal {
  // Backend fields (primary) - using snake_case from Supabase
  id: string;
  name: string;
  species: string;
  category: string;
  habitat: string | Habitat;
  description: string;
  image_url?: string; // Optional field from Supabase
  diet?: string; // Optional field from Supabase
  lifespan?: string; // Optional field from Supabase
  status: 'ACTIVE' | 'INACTIVE' | 'UNDER_CARE'; // Exact enum from Supabase
  location?: any;
  created_at?: string; // Optional field from Supabase
  updated_at?: string; // Optional field from Supabase
  _count?: {
    reviews: number;
    favorites: number;
  };
  // Legacy fields for compatibility
  _id?: string;
  type?: AnimalType;
  imageUrl?: string; // camelCase alias for image_url
  mainPhoto?: string;
  photos?: string[];
  age?: number;
  sex?: AnimalSex;
  weight?: number;
  history?: string;
  conservationStatus?: ConservationStatus;
  interestingFacts?: string[];
  averageRating?: number;
  reviewCount?: number;
  viewCount?: number;
}

export interface AnimalFormData {
  name: string;
  species: string;
  commonName?: string;
  type?: AnimalType;
  category?: string; // Support both field names
  age?: number;
  sex?: AnimalSex;
  weight?: number;
  description: string;
  history?: string;
  conservationStatus?: ConservationStatus;
  diet: string;
  interestingFacts?: string[];
  habitat: string | Habitat; // Support both string and Habitat object
  imageUrl?: string;
  image_url?: string; // Support both field names
  lifespan?: string;
  status?: string;
}






