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
  _id: string;
  name: string;
  species: string;
  commonName?: string;
  type: AnimalType;
  age: number;
  sex: AnimalSex;
  weight: number;
  photos: string[];
  mainPhoto: string;
  description: string;
  history: string;
  conservationStatus: ConservationStatus;
  diet: string;
  interestingFacts: string[];
  habitat: Habitat;
  averageRating: number;
  reviewCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
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




