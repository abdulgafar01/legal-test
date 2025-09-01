export type FilterValues = {
  expertise: string[];
  location: string;
  pricing: { min: number; max: number };
  experience: { min: number; max: number };
  ratings: string;
  availability: string;
};


export interface ApiErrorResponse {
  success: boolean;
  error: {
    code: string;
    message: string;
    timestamp: string;
    path: string;
    details?: Record<string, any>;
  };
  data: null;
}