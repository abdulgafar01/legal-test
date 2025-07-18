export type FilterValues = {
  expertise: string[];
  location: string;
  pricing: { min: number; max: number };
  experience: { min: number; max: number };
  ratings: string;
  availability: string;
};