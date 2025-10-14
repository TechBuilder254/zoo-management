export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Review {
  id: string;
  _id?: string; // For backwards compatibility
  animalId: string;
  userId: string;
  userName?: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  helpful?: number;
  // AI fields
  sentiment?: string;
  sentimentScore?: number;
  toxicity?: number;
  createdAt: string;
  updatedAt: string;
  // Relations from backend
  user?: {
    id: string;
    name: string;
  };
  animal?: {
    id: string;
    name: string;
  };
}

export interface ReviewFormData {
  animalId: string;
  rating: number;
  comment: string;
}




