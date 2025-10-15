export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Review {
  id: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  sentiment?: string;
  sentiment_score?: number;
  toxicity?: number;
  user_id: string; // snake_case from Supabase
  animal_id: string; // snake_case from Supabase
  helpful: number;
  created_at: string; // snake_case from Supabase
  updated_at: string; // snake_case from Supabase
  users?: {
    id: string;
    name: string;
    email: string;
  };
  animals?: {
    id: string;
    name: string;
  };
  // Compatibility fields (camelCase aliases)
  _id?: string;
  userId?: string; // alias for user_id
  sentimentScore?: number; // alias for sentiment_score
  createdAt?: string; // alias for created_at
  user?: {
    _id?: string;
    id: string;
    name: string;
    email: string;
  };
  userName?: string;
  animal?: {
    _id?: string;
    id: string;
    name: string;
  };
}

export interface ReviewFormData {
  rating: number;
  comment: string;
  animalId?: string;
}

export interface CreateReviewData {
  rating: number;
  comment: string;
  animal_id: string;
}

export interface UpdateReviewData {
  id: string;
  status?: ReviewStatus;
  sentiment?: string;
  sentiment_score?: number;
  toxicity?: number;
}

