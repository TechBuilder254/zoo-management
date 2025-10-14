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
  // Backend fields (primary)
  id: string;
  name: string;
  species: string;
  category: string;
  habitat: string | Habitat;
  description: string;
  imageUrl: string;
  image_url?: string; // Supabase format
  diet: string;
  lifespan: string;
  status: string;
  location?: any;
  createdAt: string;
  created_at?: string; // Supabase format
  updatedAt: string;
  updated_at?: string; // Supabase format
  _count?: {
    reviews: number;
    favorites: number;
  };
  // Legacy fields for compatibility
  _id?: string;
  type?: AnimalType;
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
  type: AnimalType;
  age: number;
  sex: AnimalSex;
  weight: number;
  description: string;
  history: string;
  conservationStatus: ConservationStatus;
  diet: string;
  interestingFacts: string[];
  habitat: Habitat;
}




