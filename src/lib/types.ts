export type FilterValues = {
  expertise: string[]; // Specialization names for display
  location: string;
  pricing: { min: number; max: number };
  experience: { min: number; max: number };
  ratings: string;
  availability: string;
  expertiseIds?: number[]; // Internal: specialization IDs for API
};

// Practitioner Types
export interface PractitionerSpecialization {
  id: number;
  name: string;
  description: string;
}

export interface Country {
  name: string;
  code: string;
  dial_code?: string;
  is_active: boolean;
}

export interface CountriesResponse {
  success: boolean;
  message: string;
  data: Country[];
}

export interface PractitionerUserInfo {
  id: number;
  first_name: string;
  last_name: string;
  profile_image: string | null;
  country: string;
  city?: string;
}

export interface Practitioner {
  id: number;
  user_info: PractitionerUserInfo;
  specializations: PractitionerSpecialization[];
  experience_level: string;
  years_of_experience: number;
  hourly_rate: number;
  bio: string;
  availability_status: string;
  total_consultations: number;
  average_rating: number;
  total_reviews: number;
  is_available_for_booking: boolean;
  is_available_now: boolean;
}

// Extended practitioner details for individual view
export interface PractitionerDetail extends Practitioner {
  education: string;
  available_slots: Array<{
    id: number;
    date: string;
    start_time: string;
    end_time: string;
    duration_minutes: number;
    is_booked?: boolean; // Optional since available slots are already filtered
  }>;
  recent_reviews: Array<{
    id: number;
    rating: number;
    review_text: string;
    reviewer_name: string;
    created_at: string;
  }>;
}

export interface PractitionersResponse {
  success?: boolean;
  message?: string;
  data?: Practitioner[];
  // DRF Pagination format
  results?: Practitioner[];
  count?: number;
  next?: string | null;
  previous?: string | null;
  // Custom response format  
  pagination?: {
    count: number;
    next: string | null;
    previous: string | null;
    page_size: number;
  };
}

export interface SpecializationsResponse {
  success: boolean;
  message: string;
  data: PractitionerSpecialization[];
}

export interface PractitionerFilters {
  search?: string;
  specializations?: number[];
  country?: string;
  min_price?: number;
  max_price?: number;
  min_experience?: number;
  min_rating?: number;
  availability_status?: string;
  ordering?: string;
  page?: number;
}


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