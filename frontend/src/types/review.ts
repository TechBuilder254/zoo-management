export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  _id: string;
  animalId: string;
  userId: string;
  userName?: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewFormData {
  animalId: string;
  rating: number;
  comment: string;
}




